import * as React from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';

const CustomSearchBar = ({ className, type, ...props }) => {
    const ref = React.useRef(null);
    return (
        <div
            className={cn(
                'flex h-10 w-full items-center rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2',
                className
            )}
        >
            <SearchIcon className='w-[18px] h-[18px]' />
            <input
                type='search'
                data-slot='input'
                ref={ref}
                className='w-full p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                {...props}
            />
        </div>
    );
};
export default CustomSearchBar;
