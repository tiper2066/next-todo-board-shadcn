'use client'; //  client 컴포넌트 변환
import LabelCalendar from '@/components/common/LabelCalendar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import BasicBoard from '@/components/common/BasicBoard'; //  BasicBoard 컴포넌트
import { useParams, usePathname, useRouter } from 'next/navigation'; //  useRouter 훅
import { useEffect, useState } from 'react'; //  useState,  useEffect 훅 추가
import { toast } from 'sonner'; //   toast 컴포넌트 가져오기
import { supabase } from '@/utils/supabase'; //  Supabase DB 저장 로직 가져오기
import { nanoid } from 'nanoid'; //  nanoid 모듈 (유일 id 생성)
import { ChevronLeft } from 'lucide-react'; //  위로 화살표 아이콘
import { useCreateBoard, useGetTaskById, useGetTasks } from '@/hooks/apis'; //   getTasks 추가
import { cn } from '@/lib/utils';
import DeleteTaskPopup from '@/components/common/DeleteTaskPopup'; //  커스텀 alert 팝업

const TaskPage = () => {
    const router = useRouter(); //  라우터 객체 생성
    const { id } = useParams(); //  url의 id 값 가져오기
    const createBoard = useCreateBoard(); //  useCreateBoard 함수 사용
    const { task, getTaskByid } = useGetTaskById(Number(id)); //  useGetTaskById 함수 사용
    const { getTasks } = useGetTasks(); //  getTasks 객체 추출

    const pathname = usePathname(); //  pathname 객체 생성 ( http://localhost:3000/create/4)
    const [boards, setBoards] = useState([]); //  board 데이터 배열
    const [title, setTitle] = useState(''); //  페이지 타이틀 담을 상태 변수
    const [startDate, setStartDate] = useState(undefined); //  시작 일 담을 상태 변수
    const [endDate, setEndDate] = useState(undefined); //  종료 일 담을 상태 변수
    const [count, setCount] = useState(0); //  완료 보드 갯수 상태 변수

    //  페이지 id에 해당하는 contents 데이터로 초기값 세팅, task 업데이트 시 호출
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setStartDate(
                task.start_date ? new Date(task.start_date) : undefined
            ); // 있으면 Date 객체로 변환
            setEndDate(task.end_date ? new Date(task.end_date) : undefined); // 있면 Date 객체로 변환
            setBoards(task.contents);
        }
    }, [task]);

    //  새 페이지 데이터 내에 보드 생성 함수
    const handleAddBoard = () => {
        // 생성할 개별 보드 컨텐츠 데이터 생성
        const newBoard = {
            id: nanoid(), //  유일 id 생성
            isCompleted: false, // 완료 여부
            title: '',
            startDate: undefined,
            endDate: undefined,
            content: '',
        };
        // board 배열에 기존에 추가된 board 가 있다면...
        const newBoards = [...boards, newBoard]; // 이미 있는 보드들의 배열을 앞에 삽입혹, 새로운 보드를 삽입해서 새 보드 배열을 생성함
        setBoards(newBoards); // 새 보드 배열을 boards 상태변수에 할당함 (화면에 보여주기용)
        createBoard(Number(id), 'contents', newBoards); // (DB와의 통신용) Supabase 테이블에 새 보드 데이터 추가: id, 보드 데이터가 추가될 필드 이름, 새 보드 데이터
    };

    // 저장 버튼 이벤트 핸들러 함수
    const handleSave = async () => {
        console.log('startDate: ', startDate);
        console.log('endDate: ', endDate);
        if (!title || !startDate || !endDate) {
            toast.error('기입되지 않은 데이터(값)가 있습니다.', {
                description: '제목, 시작일, 종료는 필수 값입니다.',
            });
            return; // 아무것도 반환하지 않아야 아래 코드가 실행되지 않음
        }

        try {
            const { data, error, status } = await supabase
                .from('todos')
                .update({
                    title: title,
                    start_date: startDate,
                    end_date: endDate,
                })
                .eq('id', id) // useParams 로 가져온 id 값과 동일한 데이터 가져오기
                .select();

            // status 204 : 삭제, 추가 등 성공 처리 후 처리한 데이터를 응답으로 반환하지 않을 경우 204 상태코드를 반환함
            if (data && status === 200) {
                toast.success('TASK 저장을 완료했습니다.', {
                    description: '수정한 TASK의 마감일을 꼭 지켜주세요.',
                });
                /*  서버에서 데이터 갱신 후 상태값 업데이트
                -- SideNavigation 컴포넌트의 메뉴 리스트를 실시간 업데이트 하기 위해 getTask 훅 호출 */
                getTasks(); // 업데이트된 데이터 실시간 반영
            }

            // 에러 있을 경우 에러 처리
            if (error) {
                console.error(error);
                toast.error('에러가 발생했습니다.', {
                    description:
                        'Supabase 오류: ${error.message} || 알 수 없는 오류.',
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
            });
        }
    };

    //  보드의 값이 변경될 때, 완료 여부 체크하는 함수
    useEffect(() => {
        if (boards) {
            // 완료된 보드들의 배열길이를 구한다.
            const completedCount = boards.filter(
                (board) => board.isCompleted
            ).length;
            setCount(completedCount); // 완료 보드 갯수 업데이트
        }
    }, [boards]);

    return (
        //  최상단 relative 포지션 스타일 추가
        <div className='flex flex-col justify-start items-center relative min-w-[920px] max-w-[1200px] h-screen bg-[#f9f9f9] border-r-[1px] border-r-[#e6e6e6]'>
            {/*  뒤로가기 및 저장 / 삭제 버튼 추가 */}
            <div className='absolute top-6 left-7 flex item-center justify-between gap-2 w-full pr-[60px]'>
                <Button
                    variant='outline'
                    size='icon'
                    onClick={() => router.back()} // 버튼 클릭시 이전 페이지로 이동
                >
                    <ChevronLeft />
                </Button>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={handleSave}
                        className='bg-green-50 hover:bg-green-100'
                    >
                        저장
                    </Button>
                    {/*  커스텀 알러트 팝업 컴포넌트 추가하고 트리거를 위한 버튼 포함  */}
                    <DeleteTaskPopup>
                        <Button
                            variant='outline'
                            className='text-rose-500 bg-red-50 hover:text-rose-600 hover:bg-rose-50'
                        >
                            삭제
                        </Button>
                    </DeleteTaskPopup>
                </div>
            </div>
            <header className='flex flex-col justify-end items-start w-full bg-white'>
                <div className='flex flex-col w-full py-5 px-7 mt-17'>
                    <input
                        type='text'
                        placeholder='Enter Title Here'
                        className='text-[36px] font-[700] outline-none [&::placeholder]:text-[#c4c4c4]'
                        value={title} //  페이지 타이틀
                        //  타이틀 변경 반영
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                    <div className='flex justify-start items-center gap-4 mt-2 mb-4'>
                        {/*  완료 보드 갯수 / 전체 보드 갯수 */}
                        <span className='text-[#6d6d6d]'>
                            전체 보드{' '}
                            <strong className='text-rose-400 pr-1'>
                                {boards.length}
                            </strong>
                            개 중,
                            <strong className='text-green-500 pl-2 pr-1'>
                                {count}
                            </strong>
                            개 완료
                        </span>
                        {/*  프로그레스바 UI: (완료갯수/전체갯수) x 100 % */}
                        <Progress
                            value={
                                boards && boards.length > 0
                                    ? (count / boards.length) * 100
                                    : 0
                            }
                            //  [&>div]:bg-green-400 : 자식요소인 indicator 색상 지정
                            className='w-[30%] h-2 [&>div]:bg-green-400'
                        />
                        {/* Math.round(): 반올림 , toFixed(2): 소숫점 2자리 표시 */}
                        <span>
                            {boards && boards.length > 0
                                ? `${Math.round(
                                      (count / boards.length) * 100
                                  ).toFixed(2)}%`
                                : '보드 없음'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-[20px]'>
                            {/*  캘린더 UI, onChange 속성 전달  */}
                            <LabelCalendar
                                label='From'
                                value={startDate}
                                onChange={setStartDate}
                            />
                            <LabelCalendar
                                label='To'
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
                        <Button
                            variant='outline'
                            className='w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white'
                            onClick={handleAddBoard}
                        >
                            Add New Board
                        </Button>
                    </div>
                </div>
            </header>
            {/*  boards 배열에 보드 컨텐츠 존재 여부에 따라 구현하는 UI - h-[calc(100%-250px)] : calc() 함수 사용, 연산자는 붙여쓴다 */}
            <div
                className={cn(
                    'flex justify-center w-full h-[calc(100%-250px)] py-7 px-4 overflow-y-auto',
                    boards.length === 0 ? 'items-center' : 'items-start'
                )}
            >
                {
                    // boards 배열이 있으면...
                    boards.length !== 0 ? (
                        <div className='flex flex-col items-center gap-4'>
                            {boards.map((board) => (
                                <BasicBoard
                                    key={board.id}
                                    data={board}
                                    handleBoards={setBoards}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
                                There is no board yet
                            </h3>
                            <small className='text-sm font-medium leading-none text-[#a6a6a6] mt-3 mb-7'>
                                Click the button and start flashing!
                            </small>
                            <button onClick={handleAddBoard}>
                                <Image
                                    src='/img/button.svg'
                                    alt='round-button'
                                    width={74}
                                    height={74}
                                />
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
export default TaskPage;
