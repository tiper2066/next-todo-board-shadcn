'use client';

import { supabase } from '@/utils/supabase'; // index.js 에서 가져옴. /client 까지 경로지정하면 Multiple 에러남
import { toast } from 'sonner'; //  toast 컴포넌트 가져옴
import { useRouter } from 'next/navigation';

const useCreateTask = () => {
    const router = useRouter();

    const createTask = async () => {
        try {
            const { data, status, error } = await supabase
                .from('todos')
                .insert([
                    {
                        title: '',
                        start_date: new Date(),
                        end_date: new Date(),
                        contents: [],
                    },
                ])
                .select(); // 생성값을 가져옴
            console.log('data: ', data);

            if (data && status === 201) {
                /** 올바르게 todos 테이블에 ROW 데이터 한 줄이 올바르게 생성되면 tasksAtom에 할당한다. */
                toast.success('새로운 TASK가 생성이 되었습니다.', {
                    description: '나만의 TODO-BOARD를 생성해보세요.',
                    duration: 3000, // 3초 딜레이
                    position: 'top-center',
                });
                router.push(`/task/${data[0].id}`); // select()로 data 에 값 하나가 겼으므로 [0]임
            }

            // Supabase 자체 에러 출력
            if (error) {
                toast.error('에러가 발생했습니다.', {
                    description: `Supabase 오류: ${error.message} || '알 수 없는 오류'`,
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

    return createTask;
};
export { useCreateTask };
