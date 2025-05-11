'use client';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
// import { useState } from 'react';

// ************************************************** value, onChange 속성 추가 전달
const LabelCalendar = ({ label, isReadOnly, value, onChange }) => {
    // console.log('value: ', value);
    // const [date, setDate] = useState(); **************************** 필요없으므로 삭제
    return (
        <div className="flex items-center gap-3">
            {/* 레이블 텍스트 */}
            <span className="text-[#6d6d6d]">{label}</span>
            {/* Shadcn UI - Popover + Datepicker + Calendar */}
            <Popover>
                <PopoverTrigger asChild>
                    {/* ************************ date 값을 value 로 변경  */}
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-[200px] justify-start text-left font-normal',
                            !value && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon />
                        {value ? (
                            format(value, 'PPP')
                        ) : (
                            <span>날짜를 선택하세요.</span>
                        )}
                    </Button>
                </PopoverTrigger>
                {/* isReadOnly=true 일 경우, 캘린더 숨김 */}
                {!isReadOnly && (
                    <PopoverContent className="w-auto p-0">
                        {/* ********************************* date -> value, setDate -> onChange 로 변경  */}
                        <Calendar
                            mode="single"
                            selected={value}
                            onSelect={onChange}
                            initialFocus
                        />
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
};
export default LabelCalendar;
