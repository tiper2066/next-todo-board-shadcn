import { atom } from 'jotai'; // 상태관리 모듈

export const sidebarStateAtom = atom('default'); // sideBar 상태변수 선언, 기본값 default
export const tasksAtom = atom([]); // 전체 Task 목록 조회 (contents 전체 값)
export const taskAtom = atom(null); // 개별 Task 조회 (개별 contents 개별 값)
