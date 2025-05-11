'use client';

import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

const useCreateBoard = () => {
    const createBoard = async (taskId, column, newValue) => {
        try {
            // todos 의 contents 필드를 수정하는 것이므로 update 이다.
            const { data, error, status } = await supabase
                .from('todos')
                .update({
                    [column]: newValue, // contents 필드에 newValue를 삽입
                })
                .eq('id', taskId) // 전달받은 taskId 와 id 필드값이 동일한 데이터 가져오기
                .select(); // 방금 생성한 데이터를 반환함

            // status 204 : 삭제, 추가 등 성공 처리 후 처리한 데이터를 응답으로 반환하지 않을 경우 204 상태코드를 반환함
            if (data && status === 200) {
                toast.success('새로운 TODO-BOARD를 생성하였습니다.', {
                    description: '생성한 TODO-BOARD를 알차게 채워보세요.',
                    duration: 3000, // 3초 딜레이
                    position: 'top-center',
                });
            }

            // 에러 있을 경우 에러 처리
            if (error) {
                console.error(error);
                toast.error('에러가 발생했습니다.', {
                    description:
                        'Supabase 오류: ${error.message} || 알 수 없는 오류.',
                    duration: 3000, // 3초 딜레이
                    position: 'top-center',
                });
            }
        } catch (error) {
            /** http 통신 에러 : 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.log(error);
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
                duration: 3000, // 3초 딜레이
                position: 'top-center',
            });
        }
    };
    return createBoard;
};
export { useCreateBoard };
