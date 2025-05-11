'use client';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useParams } from 'next/navigation';
import { useDeleteTask } from '@/hooks/apis';

const DeleteTaskPopup = ({ children }) => {
    const { id } = useParams();
    const { deleteTask } = useDeleteTask();
    return (
        <AlertDialog>
            {/* childern 으로 shadcn Button 컴포넌트를 사용하려면 asChild 키워드로 Button 컴포넌트를 button 태그 기능으로 전환할 수 있도록 함 */}
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        해당 TASK를 정말로 삭제하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        이 작업이 실행되면 다시 취소할 수 없습니다.
                        <br />
                        삭제가 진행되면 귀하의 게시물은 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            deleteTask(Number(id));
                        }}
                        className="bg-red-500 hover:bg-red-50"
                    >
                        삭제
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default DeleteTaskPopup;
