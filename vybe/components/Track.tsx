interface TrackProps {
    name: string,
    artist: string[],
    image: string
}

export default function Track() {
    return (
        <div className='max-h-[60px] h-full flex items-center gap-2 px-4 rounded-lg lg:hover:cursor-pointer lg:hover:bg-(--foreground)'>
            <figure className='h-[40px] w-[40px] rounded-lg overflow-hidden'>
                <img  className='w-full h-full' src='/placeholder.png' />
            </figure>
            <div className='flex flex-col'>
                <span className='text-[1.125rem]'>Headlines</span>
                <span className='text-[.875rem]'>Artist</span>
            </div>
        </div>
    )
}