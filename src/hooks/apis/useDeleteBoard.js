'use client';

import { supabase } from '@/utils/supabase';
import { taskAtom } from '@/store/store';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import { useGetTaskById } from './useGetTaskById';

/***  보드 삭제 기능 구현이지만 supabase 에서는 delete 가 아니라,
----- contens 컬럼의 배열안의 요소를 제거하는 것이기에 실제로는 배열 업데이트 작업이다. */
const useDeleteBoard = (taskId, boardId) => {
    const [task] = useAtom(taskAtom); // jotai 에서 관리하는 tasksAtom 상태 변수 task 추출
    const { getTaskById } = useGetTaskById(taskId); // 게시물 페이지 id를 이용한 게시물 페이지 데이터 가져오기 함수 추출

    // 그러므로 게시물 페이지 id 와 보드 id를 전달이 필요하다.
    const deleteBoard = async () => {
        try {
            const { status, error } = await supabase
                .from('todos')
                .update({
                    // 보드가 담긴 contents 필드 중에서 id 값과 boardId 가 다른 것만 추출해서 배열로 담는다.
                    // 그러므로 결국 board.id === boardId 일치하는 것은 삭제된다.
                    contents: task?.contents.filter(
                        (board) => board.id !== boardId
                    ),
                })
                .eq('id', taskId); // contest 배열에서 taskId 와 일치하는 id 값을 찾아 contents 배열을 업데이트함

            if (status === 204) {
                toast.success('선택한 TODO-BOARD가 삭제되었습니다.', {
                    description:
                        '새로운 할 일이 생기면 TODO-BOARD를 생성해주세요.',
                    duration: 3000, // 3초 딜레이
                    position: 'top-center',
                });
                getTaskById(); // 해당 Task(페이지)를 다시 가져와 화면을 갱신함
            }
            if (error) {
                toast.error('에러가 발생했습니다.', {
                    description: `supabase 오류: ${error.message} || '알 수 없는 오류'`,
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('네트워크 오류 - useDeleteBoard', {
                description: '서버와 연결할 수 었습니다. 다시 시도해주십시오',
            });
        }
    };
    return deleteBoard;
};
export { useDeleteBoard };
