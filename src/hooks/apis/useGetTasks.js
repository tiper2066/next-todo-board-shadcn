'use client';

import { tasksAtom } from '@/store/store'; //  jotai store 의 tasksAtom 전역 상태 변수 가져오기
import { supabase } from '@/utils/supabase'; // supabase DB 저장 로직 가져오기
import { useAtom } from 'jotai';
import { toast } from 'sonner';

const useGetTasks = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);
    const getTasks = async () => {
        try {
            const { data, status, error } = await supabase
                .from('todos')
                .select('*'); // 모든 데이터 가져오기

            if (status === 200) setTasks(data); // 성공하면 tasks 데이터 업데이트
            if (error) {
                toast.error('에러가 발생했습니다.', {
                    description: `supabase 오류: ${error.message} || '알 수 없는 오류'`,
                    duration: 3000,
                    position: 'top-right',
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 었습니다. 다시 시도해주십시오',
                duration: 3000,
                position: 'top-right',
            });
        }
    };
    return { getTasks, tasks };
};
export { useGetTasks };
