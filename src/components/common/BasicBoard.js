'use client'; //  client 함수로 변경
import { ChevronDown, ChevronUp } from 'lucide-react'; //  shadcn 지원 아이콘, ChevronDown 추가
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { supabase } from '@/utils/supabase'; //  supabase DB 저장 로직 가져오기
import { useParams, usePathname } from 'next/navigation'; //   useParams 훅 추가
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import LabelCalendar from './LabelCalendar';
import MDEditor from '@uiw/react-md-editor'; //  마크다운 컴포넌트 가져옴
import MAarkdownDialog from './MarkdownDialog'; //  추가
import { useDeleteBoard } from '@/hooks/apis'; //  보드 삭제 커스텀 훅 가져오기
import { useState } from 'react'; //  useState 훅 추가

//  page 로 부터 특정 보드 data 속성 전달받음,  handleBoards (setBoards) 함수 전달받음
const BasicBoard = ({ data, handleBoards }) => {
    const pathname = usePathname(); //   usePathname 객체 생성
    const id = Number(pathname.split('/')[2]);
    const handleDeleteBoard = useDeleteBoard(id, data.id); //  useDeleteBoard 훅으로 개별 보드 삭제하기
    const [isShowContent, setIsShowContent] = useState(false); //  마크다운에디터 보기여부

    return (
        <Card className='w-full flex flex-col items-center p-5 gap-3'>
            {/* -------------- 게시물 카드 영역 -------------- */}
            <div className='w-full flex items-center justify-between mb-4'>
                <div className='w-full flex items-center justify-start gap-2'>
                    <Checkbox className='w-5 h-5' checked={data.isCompleted} />
                    <input
                        type='text'
                        placeholder='등록된 제목이 없습니다.'
                        className='w-full text-xl outline-none bg-transparent'
                        value={data.title}
                        disabled={true}
                    />
                </div>
                {/*  마크다운에디터 보임/숨김 토글 버튼  */}
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsShowContent(!isShowContent)}
                >
                    {isShowContent ? (
                        <ChevronUp className='text-[#6d6d6d]' />
                    ) : (
                        <ChevronDown className='text-[#6d6d6d]' />
                    )}
                </Button>
            </div>
            {/* -------------- 캘린더 및 버튼 박스 영역 -------------- */}
            <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <LabelCalendar
                        label='From'
                        isReadOnly={true}
                        value={data.start_date}
                    />
                    <LabelCalendar
                        label='To'
                        isReadOnly={true}
                        value={data.end_date}
                    />
                </div>
                <div className='flex items-center'>
                    <Button
                        variant='ghost'
                        className='font-narmal text-color=[#6d6d6d]'
                    >
                        Duplicate
                    </Button>
                    <Button
                        variant='ghost'
                        className='font-narmal text-rose-600 hover:text-rose-600 hover:bg-rose-50'
                        onClick={handleDeleteBoard} //  보드 삭제 함수 호출
                    >
                        Delete
                    </Button>
                </div>
            </div>
            {/* ------------  MDEditor 삽입 ------------ */}
            {isShowContent && (
                <MDEditor
                    height='100%'
                    value={data.content ? data.content : '**Hello, World!**'} //  content가 있으면 데이터 바인딩
                    className='w-full mt-4 '
                />
            )}
            <Separator className='my-3' />
            {/* --------------  마크다운 컴포넌트로 트리거 버튼을 감싼다: 버튼이 children 이 됨 -------------- */}
            <MAarkdownDialog data={data}>
                <Button variant='ghost' className='font-normal text-[#6d6d6d]'>
                    {data.title ? 'Update Contents' : 'Add Contents'}
                </Button>
            </MAarkdownDialog>
        </Card>
    );
};
export default BasicBoard;
