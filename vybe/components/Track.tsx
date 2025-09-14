export default function Track({
  id,
  name,
  artist,
  image,
  onClick,
}: {
  id: string;
  name: string;
  artist: string[];
  image: string;
  onClick?: ({id, name, artist, image} : {id: string, name: string, artist: string[], image: string}) => void;
}) {
    return (
        <div onClick={() => onClick && onClick({id, name, artist, image})} key={id} className='max-h-[60px] h-full flex items-center gap-2 px-4 py-2 rounded-lg lg:hover:cursor-pointer lg:hover:bg-(--foreground)'>
            <figure className='h-[40px] w-[40px] min-h-[40px] min-w-[40px] rounded-lg overflow-hidden'>
                <img className='w-full h-full' alt='Album Cover' src={image} />
            </figure>
            <div className='flex flex-col w-full overflow-hidden '>
                <span className='text-[1.125rem] truncate'>{name}</span>
                <span className='text-[.875rem] truncate'>{artist}</span>
            </div>
        </div>
    )
}