'use client'; //  client 컴포넌트 변환

import { useCreateTask, useGetTasks } from '@/hooks/apis'; //   커스텀훅에서 useGetTasks

import { Button } from '../ui/button';
import CustomSearchBar from './CustomSearchBar'; //  CustomSearchBar 컴포넌트 가져오기
import { useEffect, useState } from 'react'; //  useEffect,  useState 훅 추가
import { useParams, useRouter } from 'next/navigation'; //  useParams, useRouter
import { useSearch } from '@/hooks/apis/useSearch'; //  커스텀 검색 함수

const SideNavagation = () => {
    const { id } = useParams(); //  라우트 경로의 id 추출
    const router = useRouter(); //  라우터 객체 생성
    const { tasks, getTasks } = useGetTasks(); //  커스텀 훅에 설정된 상태값과 함수 추출
    const handleCreateTask = useCreateTask(); //  커스텀 훅에서 가져오는 페이지(Task생성) 추가 함수
    const { search } = useSearch(); //  커스텀 훅에서 search 함수 추출
    const [searchTerm, setSearchTerm] = useState(''); //  검색어 상태 변수

    /*  getTasks 는 최초 한번만 호출됨: id 의존성 */
    useEffect(() => {
        getTasks();
    }, [id]);

    //  검색어 변경 시 이벤트 핸들러
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value); // 입력값 변경 적용
    };
    //  검색 기능 구현
    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            // useSearch 커스텀 훅 실행하도록 함
            search(searchTerm); // 검색어로 커스텀 훅 이용하여 검색함
        }
    };

    return (
        //  aside 태그로 감싸는 UI
        <aside className='flex flex-col justify-start w-[282px] h-screen py-5 px-6 gap-3 bg-white border-x-[1px] border-[#f4f4f5]'>
            <div className='flex flex-col h-full gap-3'>
                {/* ---------  검색창 UI - CustomSearchBar 컴포넌트, 이벤트 핸들러 추가  */}
                <CustomSearchBar
                    placeholder='검색어를 입력하세요.'
                    onChange={handleSearchTermChange}
                    onKeyDown={handleSearch}
                />
                {/* --------- Add New Page 버튼 UI --------- */}
                <Button
                    className='text-[#e79057] bg-white border border-[#e79057] hover:bg-[#fff9f5]'
                    onClick={handleCreateTask}
                >
                    Add New Page
                </Button>
                {/* --------- TASK 목록 --------- */}
                <div className='flex flex-col mt-4 gap-2'>
                    <small className='text-sm font-medium leading-none text-[#a6a6a6]'>
                        <span className='text-neutral-700'>Tiper님</span>의 TASK
                    </small>
                    {/*  이 아래 부분 수정  */}
                    <ul className='flex flex-col'>
                        {tasks.length === 0 ? (
                            //  Supabase에 생성한 tasks 데이터가 없을 경우
                            <li className='bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400'>
                                <div className='h-[6px] w-[6px] rounded-full bg-neutral-400'></div>
                                등록된 Task가 없습니다.
                            </li>
                        ) : (
                            //  Supabase에 생성한 tasks 데이터가 있는 경우
                            tasks.map((task) => {
                                return (
                                    //   task.id와 id의 값이 일치하는 경우만 메뉴 배경 변경
                                    <li
                                        key={task.id}
                                        onClick={() =>
                                            router.push(`/task/${task.id}`)
                                        }
                                        className={`${
                                            task.id === Number(id) &&
                                            'bg-[#f5f5f5]'
                                        } min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm cursor-pointer`}
                                    >
                                        {/* 원형 돗 : task.id와 id의 값이 일치/불일치 시 배경 변경 */}
                                        <div
                                            className={`${
                                                task.id === Number(id)
                                                    ? 'bg-[#00f38d]'
                                                    : 'bg-natural-400'
                                            } h-[6px] w-[6px] rounded-full'`}
                                        ></div>
                                        {/* 메뉴 제목 : 현재 페이지 메뉴면 배경 변경, 제목이 없을 경우 처리  */}
                                        <span
                                            className={`${
                                                task.id !== Number(id) &&
                                                'text-neutral-400 truncate'
                                            }`}
                                        >
                                            {task.title
                                                ? task.title
                                                : '등록된 제목 없음'}
                                        </span>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </aside>
    );
};
export default SideNavagation;
