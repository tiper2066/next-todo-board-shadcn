// import { Gothic_A1 } from 'next/font/google';
import { Noto_Sans_KR } from 'next/font/google'; // 구글 Noto_Sans_KR 폰트로 변경

import '@/styles/globals.css';
import SideNavagation from '@/components/common/SideNavigation';
import { Toaster } from '@/components/ui/sonner'; // *********** 추가

// Gothic_A1 폰트 설정
/*
const gothicA1 = Gothic_A1({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // 지원하는 폰트 굵기 선택
    subsets: ['latin'], // 라틴 문자 지원, 한글은 명시하지 않아도 됨 (명시하면 에러남)
    display: 'swap', // 폰트 로딩 전략 (swap, block, optional 등)
});
*/

// Noto_Sans_KR 구글 폰트 설정
const NOTO_SANS_KR = Noto_Sans_KR({ subsets: ['latin'] }); // 라틴 문자 지원, 한글은 명시하지 않아도 됨 (명시하면 에러남)

export const metadata = {
    title: 'SHADCN - TODO TASKBOARD',
    description: 'Next.js + Shadcn UI + Supabase Todoboard',
};

export default function RootLayout({ children }) {
    return (
        // <html lang="ko" className={gothicA1.className}>
        <html lang='ko' className={NOTO_SANS_KR.className}>
            <body>
                <SideNavagation />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
