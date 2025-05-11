'use client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; //  VisuallyHidden 컴포넌트 가져옴(사용안하는 Dialog 요소 감쌀경우 사용)
import { useGetTaskById } from '@/hooks/apis'; //  useGetTaskById 훅 가져오기
import MDEditor from '@uiw/react-md-editor'; //  마크다운 컴포넌트 가져옴
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import LabelCalendar from './LabelCalendar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner'; //  toast 컴포넌트 가져옴
import { Megaphone } from 'lucide-react'; //  toast에 사용할 아이콘
import { useParams } from 'next/navigation'; //  useParams 훅
import { useCreateBoard } from '@/hooks/apis'; //  커스텀훅에서 useCreateBoard 가져오기

//  children 속성 받음
const MAarkdownDialog = ({ data, children }) => {
    const { id } = useParams(); //  useParams 객체 생성
    const { task, getTaskById } = useGetTaskById(Number(id)); //  task 추출
    const updateBoard = useCreateBoard(); // useCreateBoard 커스템 훅 객체 생성

    //  상태값 정리
    const [isCompleted, setIsCompleted] = useState(false); //  완료 여부 상태 변수
    const [title, setTitle] = useState(''); //  다이얼로그 창의 타이틀 담을 상태 변수
    const [startDate, setStartDate] = useState(undefined); //   시작일 상태 변수
    const [endDate, setEndDate] = useState(undefined); //   종료일 상태 변수
    const [contents, setContents] = useState('**Hello, World!**' || undefined); // 옵시디안 처럼 마크다운 코드 법칙 적용
    const [isDialogOpen, setIsDialogOpen] = useState(false); //  다이얼로그 창의 열림 여부 상태 변수
    const [taskLoaded, setTaskLoaded] = useState(false); //  task 값 변경 여부 상태 변수

    //  상태값 초기화 코드 - 다이얼로그 창 닫히는 순간 적용
    const initState = () => {
        setIsCompleted(data.isCompleted || false);
        setTitle(data.title || '');
        setStartDate(data.start_date ? new Date(data.start_date) : undefined);
        setEndDate(data.end_date ? new Date(data.end_date) : undefined);
        setContents(data.content || '**Hello, World!**');
    };

    // Supabase 에 보드: contents 데이터 수정 - 다이얼로그 컴포넌트에서만 사용되므로 별도 파일로 분리안해도됨
    const handleSubmit = async (boardId) => {
        // console.log('MD boardId: ', boardId);
        // -------- 다이얼로그 입력/선택 요소 체크  -------
        if (!title || !startDate || !endDate || !contents) {
            toast.error('입력되지 않은 데이터(값)가 있습니다.', {
                // 각 요소마다 커스텀 스타일 적용 가능
                classNames: {
                    icon: '!mr-5', // 아이콘과 컨텐츠 사이간격
                },
                description:
                    '제목, 날짜 혹은 콘텐츠 값은 필수입니다. 모두 작성해주세요.',
                duration: 3000, // 3초 딜레이
                position: 'top-center',
                icon: <Megaphone />,
            });
            return;
        }
        // --------  Supabase DB에 저장  -------
        try {
            // 전달된 data 게시물의 contents 배열에서 선택한 board 찾고, 수정된 값으로 업데이트 (  ? 는 task 초기값이 null 일 수도 있으므로)
            const newBoards = task?.contents.map((board) => {
                // 현재 전달된 보드 id 값이, 데이터에서 가져온 boardId 와 일치한다면... 수정값들을 반환해줌
                if (board.id === boardId) {
                    return {
                        ...board,
                        title,
                        start_date: startDate,
                        end_date: endDate,
                        content: contents,
                        isCompleted,
                    };
                }

                return board; // id 값이 일치하지 않는 보드는 기존값 그대로 반환
            });
            // console.log('newBoards aa: ', newBoards);

            await updateBoard(Number(id), 'contents', newBoards); // id: useParams.id, 커스텀훅 데이터 수정 함수 totos.contents 필드에 저장
            handleCloseDialog(); // 다이얼로그 닫기
            getTaskById(); // ***************************** task 목록 다시 가져와 화면 갱신
        } catch (error) {
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
                duration: 3000,
                position: 'top-right',
            });
            throw error;
        }
    };

    // ***************************** 다이얼로그 상태 변경시 호출되고 열릴때만 상태값 초기화
    useEffect(() => {
        if (isDialogOpen) {
            initState(); // 열릴 때만 상태 초기화
        }
    }, [isDialogOpen]); // isDialogOpen 값 변경시 호출

    // 다이얼로그 닫힘 이벤트 핸들러 함수
    const handleCloseDialog = () => {
        setIsDialogOpen(false); // 다이얼로그 닫기
        initState(); // 상태값 초기화
    };

    return (
        //  디이얼로그 여닫기 속성과 함수 적용
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            {/* max-w-fit: max-width 가 fit-content 로 설정됨  */}
            <DialogContent className="sm:max-w-fit min-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center justify-start gap-2 w-[45vw]">
                            <Checkbox
                                className="w-5 min-w-5 h-5"
                                checked={isCompleted} //  isCompleted 데이터 바인딩
                                //  checked 타입이 불값일 경우만 isCompleted 업데이트
                                onCheckedChange={(checked) => {
                                    if (typeof checked === 'boolean') {
                                        setIsCompleted(checked);
                                    }
                                }}
                            />
                            <input
                                type="text"
                                placeholder="게시물의 제목을 입력하세요."
                                className="w-full outline-0 border-0 text-xl font-medium text-[#303030] [&::placeholder]:text-[#bdbdbd] [&::placeholder]:font-medium"
                                value={title} //  title 데이터 바인딩
                                onChange={(e) => setTitle(e.target.value)} //  다이얼로그 타이틀 값 변경 함수
                            />
                        </div>
                    </DialogTitle>
                    {/* <VisuallyHidden> */}
                    <DialogDescription>
                        마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게
                        꾸며보세요.
                    </DialogDescription>
                    {/* </VisuallyHidden> */}
                </DialogHeader>
                <div className="flex items-center gap-5">
                    {/*  날자 설정 UI 에 해당 데이터 바인딩  */}
                    <LabelCalendar
                        label="From"
                        value={startDate}
                        onChange={setStartDate}
                    />
                    <LabelCalendar
                        label="To"
                        value={endDate}
                        onChange={setEndDate}
                    />
                </div>
                <Separator />
                {/*  MDEditor 삽입  */}
                <MDEditor
                    height="100%"
                    value={contents} //  contents 데이터 바인딩
                    onChange={setContents}
                    className="min-h-[320px]"
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">취소</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        className="font-normal border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
                        onClick={() => handleSubmit(data.id)}
                    >
                        등록
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default MAarkdownDialog;
