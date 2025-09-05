import Image from "next/image";
import LoginButton from '@/components/LoginButton';

export default function Home() {
  return (
    <section className='flex w-screen h-screen px-8'>
      <figure className='hidden lg:block relative w-full'>
        <Image
          className='object-cover'
          src="/loginPhoto.jpg"
          alt="Placeholder"
          fill={true}
        />
      </figure>
      <div className='flex flex-col gap-8 items-center justify-center w-full h-screen'>
        <div className=' flex flex-col gap-2 text-center'>
          <h1>Welcome To <span className="text-(--ctaColor)">Vybe</span></h1>
          <p>A Next.JS application using Spotify API to allow the creation of Spotify Playlist</p>
        </div>
        <LoginButton />
        <a className='font-sub font-normal lg:hover:text-(--ctaColor) underline' href='https://github.com/BrendonianSL/Vybe' target="_blank">View Repository</a>
      </div>
    </section>
  );
}
