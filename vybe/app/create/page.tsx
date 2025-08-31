'use client';
import { useState } from 'react';
import AddTrack from '@/components/AddTrack';
import Track from '@/components/Track';

// Variables to hold playlist names and descriptions.
const playlistNames = ['Vybin', 'Wavez', 'Chill', 'Pulse', 'Hype', 'Bumpin', 'Boomin'];
const playlistDescriptions = [
    ''
]

// Function to change the playlist name.
const changeName = () => {

}


export default function Create() {
    // Keeps track of playlist name.
    const [name, setName] = useState(null);

    // Keeps track of playlist description.
    const [description, setDescription] = useState(null);

    // Keeps track of the current tracklist.
    const [tracks, setTracks] = useState([]);

    return (
        <section className='flex gap-2 h-screen w-full max-w-[82.5rem]'>
            <div className='bg-(--midground) rounded-lg p-5 h-screen w-full max-w-[25rem]'>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <h2>Vybin</h2>
                        <p>Playlist Description</p>
                    </div>
                    <div className='flex w-full gap-4'>
                        <div className='flex gap-2 text-[.875rem] items-center rounded-lg px-3 py-2 bg-(--foreground) lg:hover:bg-(--foregroundHover) lg:hover:cursor-pointer'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 16H5V21M14 8H19V3M4.58301 9.0034C5.14369 7.61566 6.08244 6.41304 7.29255 5.53223C8.50266 4.65141 9.93686 4.12752 11.4298 4.02051C12.9227 3.9135 14.4147 4.2274 15.7381 4.92661C17.0615 5.62582 18.1612 6.68254 18.9141 7.97612M19.4176 14.9971C18.8569 16.3848 17.9181 17.5874 16.708 18.4682C15.4979 19.3491 14.0652 19.8723 12.5723 19.9793C11.0794 20.0863 9.58606 19.7725 8.2627 19.0732C6.93933 18.374 5.83882 17.3175 5.08594 16.0239" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Change Name
                        </div>
                        <div className='flex gap-2 text-[.875rem] items-center rounded-lg px-3 py-2 bg-(--foreground) lg:hover:bg-(--foregroundHover) lg:hover:cursor-pointer'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 16H5V21M14 8H19V3M4.58301 9.0034C5.14369 7.61566 6.08244 6.41304 7.29255 5.53223C8.50266 4.65141 9.93686 4.12752 11.4298 4.02051C12.9227 3.9135 14.4147 4.2274 15.7381 4.92661C17.0615 5.62582 18.1612 6.68254 18.9141 7.97612M19.4176 14.9971C18.8569 16.3848 17.9181 17.5874 16.708 18.4682C15.4979 19.3491 14.0652 19.8723 12.5723 19.9793C11.0794 20.0863 9.58606 19.7725 8.2627 19.0732C6.93933 18.374 5.83882 17.3175 5.08594 16.0239" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Change Description
                        </div>
                    </div>
                </div>
                <div className='py-8'>
                    <Track />
                </div>
            </div>
            <div className='flex flex-col gap-4 bg-(--midground) rounded-lg w-full p-5'>
                <div className='flex flex-col gap-2'>
                    <h2>Song Search</h2>
                    <input className={'bg-(--foreground) rounded-lg w-full p-4 text-white'} type='text' placeholder='What songs do you like?' />
                </div>
                <div>
                    <Track />
                    <Track />
                    <Track />
                    <Track />
                </div>
            </div>
        </section>
    )
}