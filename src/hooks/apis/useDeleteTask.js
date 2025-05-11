'use client';

import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const useDeleteTask = () => {
    const router = useRouter();
    const deleteTask = async (taskId) => {
        try {
            const { status, error } = await supabase
                .from('todos')
                .delete()
                .eq('id', taskId);
            if (status === 204) {
                toast.success('선택한 TASK가 삭제되었습니다.', {
                    description: '새로운 TASK가 생기면 언제든 추가해주세요.',
                    duration: 3000, // 3초 딜레이
                    position: 'top-center',
                });
                router.push('/');
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
            toast.error('네트워크 오류', {
                description: '서버와 연결할 수 었습니다. 다시 시도해주십시오',
                duration: 3000,
                position: 'top-right',
            });
        }
    };
    return { deleteTask };
};
export { useDeleteTask };
