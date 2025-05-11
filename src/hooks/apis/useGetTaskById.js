'use client';

import { taskAtom } from '@/store/store'; //  jotai store 의 tasksAtom 전역 상태 변수 가져오기
import { supabase } from '@/utils/supabase'; // supabase DB 저장 로직 가져오기
import { useAtom } from 'jotai'; // tasksAtom 보다 아래에 위치해야함 !!!!!!!!!!!!! 중요 !!!!!!!!!!!!!!!
import { toast } from 'sonner';
import { useEffect } from 'react';

// taskId 로 현재 페이지 id 를 받음
const useGetTaskById = (taskId) => {
    const [task, setTask] = useAtom(taskAtom); // 데이터를 담을 상태 변수
    // 현재 페이지 id의 contents 데이터 가져오기 함수
    const getTaskById = async () => {
        try {
            const { data, status, error } = await supabase
                .from('todos')
                .select('*')
                .eq('id', taskId); // 전체를 조회한 후 id 컬럼값 === taskId 인 데이터를 가져옴

            // data가 있고 성공/응답이 있으면.. 0번째 데이터로 업데이트함
            if (data && status === 200) setTask(data[0]); // tasks 데이터는 배열로 받기에.. [ {id, title, content, ... } ] 이런식임
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

    // taskId 업데이트시 함수 호출함
    useEffect(() => {
        if (taskId) getTaskById(); // taskId가 있을때만 함수 호출
    }, [taskId]);

    return { getTaskById, task };
};
export { useGetTaskById };
