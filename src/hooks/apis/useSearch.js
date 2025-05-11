'use client';

import { supabase } from '@/utils/supabase';
import { useAtom } from 'jotai';
import { tasksAtom } from '@/store/store';
import { toast } from 'sonner';

const useSearch = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);

    // 사용자로 부터 검색어를 받음
    const search = async (searchTerm) => {
        try {
            // ilike() : 기준필드, 검색어중 한글자라도 포함된 값 `%${searchTerm}%`
            const { data, status, error } = await supabase
                .from('todos')
                .select('*')
                .ilike('title', `%${searchTerm}%`); // 기준필드, 검색어중 한글자라도 포함된 값

            if (data && status === 200) setTasks(data); // jotai tasksAtome 을 업데이트함
            if (error) {
                toast.error('에러가 발생했습니다.', {
                    description: `Supabase 오류: ${error.message} || '알 수 없는 오류'`,
                });
            }
        } catch (error) {
            /** http 통신 에러 : 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
            console.log(error);
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 없습니다. 다시 시도해주세요.',
            });
        }
    };
    return { search };
};
export { useSearch };
