'use client';
import { Button } from '@/components/ui/button';
import { useCreateTask } from '@/hooks/apis'; // 커스텀 훅 가져오기

export default function Home() {
    const handleCreateTask = useCreateTask();

    return (
        <div className="flex justify-center items-center min-w-[920px] max-w-[1200px] h-screen bg-[#f9f9f9] border-r-[1px] border-r-[#d6d6d6]">
            <div className="flex flex-col justify-center items-center w-[200px] gap-[20px]">
                <span className="text-[28px] font-[700] text-[#454545]">
                    How to Start:
                </span>
                <div className="flex flex-col justify-center items-center gap-[8px] text-[18px] text-[#454545]">
                    <span>1. Create a page</span>
                    <span>2. Add boards to page</span>
                </div>
                {/* 페이지 추가 버튼 */}
                <Button
                    variant="outline"
                    className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
                    onClick={handleCreateTask} //  페이지 생성 및 멀티 라우팅 이용 페이지 이동
                >
                    Add New Page
                </Button>
            </div>
        </div>
    );
}
