import { createBrowserClient } from '@supabase/ssr';

//****** 한번에 여러곳에서 사용하면 GoTrueClient 경고가 뜸
export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );
export const supabase = createClient();

// *********** Singleton 패턴으로 사용하기
/* 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let supabase;

export const getSupabase = () => {
    if (!supabase) {
        supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return supabase;
};
*/

// 3번째 해결책
/*
const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);
export default supabase;
*/

// 4번 해결책- 싱글톤 인스턴스 저장
/*
let supabaseClient = null;

export const getSupabase = () => {
    if (!supabaseClient) {
        supabaseClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }
    return supabaseClient;
};
*/
