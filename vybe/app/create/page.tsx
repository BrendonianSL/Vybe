'use client';

import { useState, useEffect } from 'react';
import Track from '@/components/Track';
import TrackRemove from '@/components/TrackRemove';
import { Suspense } from 'react';

// Defines the shape needed for our Set.
interface TrackInfo {
    id: string,
    name: string,
    image: string,
    artist: string
}

interface Artist {
    name: string
}

interface SearchResults {
    uri: string,
    name: string,
    id: string,
    album: {
        images: { url: string }[];
    };
    artists: Artist[]
}

export default function Create() {
    const [open, setOpen] = useState(false); // State to track whether the playlist is open or closed.
    const [name, setName] = useState(0); // State to track the index of the playlist name.
    const [tokenData, setTokenData] = useState(''); // State to track the access token data.
    const [searchTerm, setSearchTerm] = useState(''); // State to track the current serach term.
    const [tracks, setTracks] = useState<Map<string, TrackInfo>>(new Map()); // State to track the current tracks.
    const [description, setDescription] = useState(0); // State to track the current description.
    const [searchResults, setSearchResults] = useState([]); // State to track the current search results.
    

    // Variables to hold playlist names and descriptions.
    const playlistNames = ['Vybin', 'Wavez', 'Chill', 'Pulse', 'Hype', 'Bumpin', 'Boomin'];

    // Variable to hold playlist descriptions.
    const playlistDescriptions = ['Chill vibes for any mood', 'Pump up your energy', 'Late night study jams', 'Raod trip sing-alongs', 'Fell-good morning tunes', 'Rainy day relaxation mix', 'Party hits nonstop'];

    // Grabs the search parameters from the url.
    const searchParams = new URLSearchParams(window.location.search);

    // Function to rotate the playlist names.
    const rotateName = () => {
        setName((name + 1) % playlistNames.length);
    }

    // Function to rotate the playlist descriptions.
    const rotateDescription = () => {
        setDescription((description + 1) % playlistDescriptions.length);
    }
    
    const addTrack = ({ id, name, artist, image }: TrackInfo) => {
        setTracks((prev) => {
            // If the track already exists, just return the same map
            if (prev.has(id)) return prev;

            // Create a new map (immutable update pattern)
            const newMap = new Map(prev);
            newMap.set(id, { id, name, artist, image });

            return newMap;
        });
    };

    const removeTrack = (id: string) => {
        if(!tracks.has(id)) return;

        setTracks((prev) => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        })
    }

    // Creates The Playlist.
    const createPlaylist = async () => {
        // Grab the user id.
        const response = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenData}`
            }
        });

        // Immediately parses the object.
        const data = await response.json();

        console.log(data);

        // If the response is not ok, send an error code to the user's browser.
        if(!response.ok) {
            window.alert(`Error ${data.error.status}: ${data.error.message}`);
            return; //Leave the function.
        }

        // Create the playlist.
        const playlistResponse = await fetch('/api/spotify/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: data.id,
                name: playlistNames[name],
                description: playlistDescriptions[description],
                token: tokenData
            })
        });

        // If the response is not ok, send an error code to the user's browser.
        if(!playlistResponse.ok) {
            window.alert(`Error ${data.error.status}: ${data.error.message}`);
            return; // Leave the function.
        }

        // Grabs the playlist id from the response. Change it immediately.
        let playlistId = await playlistResponse.json();
        playlistId = playlistId.id;

        // Add tracks to playlist.
        const trackResponse = await fetch('/api/spotify/addtracks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                playlistID: playlistId,
                tracks: Array.from(tracks.keys()),
                token: tokenData
            })
        });

        //If the response is not ok, send an error code to the user's browser.
        if(!trackResponse.ok) {
            window.alert(`Error with adding tracks to playlist.`);
            return; // Leave the function.
        };

        // Close Mobile Menu If On Mobile.
        if(window.innerWidth < 1024) {
            // Close the mobile menu.
            setOpen(false);
        }

        // Tell the user that the resource has been created.
        window.alert('Playlist successfully created!');

        // Empties out the playlist.
        setTracks(new Map());
    }

    /* WILL WORK ON LATER.
    const checkExpiration = async () => {
        // Check if the current time is greater than the time it is going to expire.
        if(Date.now() > refreshData.expiration) {
            // Call our server to refresh the token for us.
            const response = await fetch('/api/spotify/token/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Sending the server the data in json format.
                },
                body: JSON.stringify({
                    refresh_token: refreshData.refresh_token
                })
            });

            // Check the response.
            if(!response.ok) {

            }

            // Parse the response.
            const data = await response.json();
        }
    }*/

    // Effect to fetch the access token on mount.
    useEffect(() => {
        async function start() {
            // If there is no code, redirect to the login page.
            if(!searchParams.get('code')) {
                window.location.href = '/';
            }

            const response = await fetch('/api/spotify/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: searchParams.get('code')
                })
            });

            // If the response fails, send an error code to the user.
            if(!response.ok) {
                // Code is invalid or expired. Redirect the user to the login page.
                window.location.href = '/';
            }

            // Parses data from json.
            let data = await response.json();

            // Resets the value to the access token.
            data = data.data.access_token;

            // Changes value of the state.
            setTokenData(data);
        }

        // Calls the above function.
        start();
    }, [searchParams, tokenData]);

    // Effect to fetch song information when search term changes.
    useEffect(() => {
  const fetchTracks = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenData}`,
          },
        }
      );

      if (!response.ok) {
        // Handle error on the client
        console.error('Could not fetch tracks');
        setSearchResults([]); // optionally clear previous results
        return;
      }

      const data = await response.json();
      setSearchResults(data.tracks.items); // update state
    } catch (err) {
      console.error('Fetch error:', err);
      setSearchResults([]);
    }
  };

  if (searchTerm && tokenData) {
    fetchTracks();
  }
}, [searchTerm, tokenData]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
            setOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setOpen]);


    return (
        <Suspense fallback={<div>Loading...</div>}>
                    <section className='relative flex flex-col gap-2 h-screen w-full max-w-[82.5rem] p-4 rounded-lg overflow-hidden'>
            <div className='relative flex gap-2 h-full'>
                <div className={`z-10 absolute lg:relative lg:block bg-(--midground) rounded-lg lg:p-5 h-full ${open ? 'w-full p-5' : 'w-0 p-0'} overflow-hidden lg:w-full max-w-[25rem]`}>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <h2>{playlistNames[name]}</h2>
                        <p>{playlistDescriptions[description]}</p>
                    </div>
                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex gap-4 items-center justify-between'>
                            <div onClick={() => rotateName()} className='flex gap-2 text-[.875rem] items-center rounded-lg px-3 py-2 bg-(--foreground) lg:hover:bg-(--foregroundHover) lg:hover:cursor-pointer w-full'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 16H5V21M14 8H19V3M4.58301 9.0034C5.14369 7.61566 6.08244 6.41304 7.29255 5.53223C8.50266 4.65141 9.93686 4.12752 11.4298 4.02051C12.9227 3.9135 14.4147 4.2274 15.7381 4.92661C17.0615 5.62582 18.1612 6.68254 18.9141 7.97612M19.4176 14.9971C18.8569 16.3848 17.9181 17.5874 16.708 18.4682C15.4979 19.3491 14.0652 19.8723 12.5723 19.9793C11.0794 20.0863 9.58606 19.7725 8.2627 19.0732C6.93933 18.374 5.83882 17.3175 5.08594 16.0239" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Name    
                            </div>
                            <div onClick={() => rotateDescription()} className='flex gap-2 text-[.875rem] items-center rounded-lg px-3 py-2 bg-(--foreground) lg:hover:bg-(--foregroundHover) lg:hover:cursor-pointer w-full'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 16H5V21M14 8H19V3M4.58301 9.0034C5.14369 7.61566 6.08244 6.41304 7.29255 5.53223C8.50266 4.65141 9.93686 4.12752 11.4298 4.02051C12.9227 3.9135 14.4147 4.2274 15.7381 4.92661C17.0615 5.62582 18.1612 6.68254 18.9141 7.97612M19.4176 14.9971C18.8569 16.3848 17.9181 17.5874 16.708 18.4682C15.4979 19.3491 14.0652 19.8723 12.5723 19.9793C11.0794 20.0863 9.58606 19.7725 8.2627 19.0732C6.93933 18.374 5.83882 17.3175 5.08594 16.0239" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Description
                            </div>
                        </div>
                        <div onClick={() => {createPlaylist()}} className='flex items-center justify-center gap-2 text-[.875rem] rounded-lg px-3 py-2 bg-(--ctaColor) lg:hover:bg-(--ctaHover) lg:hover:cursor-pointer'>                            
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 20.0001H20M4 20.0001V16.0001L12 8.00012M4 20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Create
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 py-8'>
                    { tracks.values().map((track : TrackInfo) => (<TrackRemove key={track.id} id={track.id} name={track.name} artist={track.artist} image={track.image} onClick={removeTrack} />)) }
                </div>
                </div>
                <div onClick={() => setOpen(false)} className={`${open ? 'block' : 'hidden'} z-5 absolute w-full h-full bg-black opacity-50`}></div>
                <div className='flex flex-col gap-4 bg-(--midground) grow rounded-lg p-5 max-h-full'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex justify-between items-center'>
                            <h2>Song Search</h2>
                            <svg onClick={() => setOpen((prev) => !prev)} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 6C2.25 5.80109 2.32902 5.61032 2.46967 5.46967C2.61032 5.32902 2.80109 5.25 3 5.25H21C21.1989 5.25 21.3897 5.32902 21.5303 5.46967C21.671 5.61032 21.75 5.80109 21.75 6C21.75 6.19891 21.671 6.38968 21.5303 6.53033C21.3897 6.67098 21.1989 6.75 21 6.75H3C2.80109 6.75 2.61032 6.67098 2.46967 6.53033C2.32902 6.38968 2.25 6.19891 2.25 6ZM2.25 10C2.25 9.80109 2.32902 9.61032 2.46967 9.46967C2.61032 9.32902 2.80109 9.25 3 9.25H21C21.1989 9.25 21.3897 9.32902 21.5303 9.46967C21.671 9.61032 21.75 9.80109 21.75 10C21.75 10.1989 21.671 10.3897 21.5303 10.5303C21.3897 10.671 21.1989 10.75 21 10.75H3C2.80109 10.75 2.61032 10.671 2.46967 10.5303C2.32902 10.3897 2.25 10.1989 2.25 10ZM2.25 14C2.25 13.8011 2.32902 13.6103 2.46967 13.4697C2.61032 13.329 2.80109 13.25 3 13.25H11C11.1989 13.25 11.3897 13.329 11.5303 13.4697C11.671 13.6103 11.75 13.8011 11.75 14C11.75 14.1989 11.671 14.3897 11.5303 14.5303C11.3897 14.671 11.1989 14.75 11 14.75H3C2.80109 14.75 2.61032 14.671 2.46967 14.5303C2.32902 14.3897 2.25 14.1989 2.25 14ZM2.25 18C2.25 17.8011 2.32902 17.6103 2.46967 17.4697C2.61032 17.329 2.80109 17.25 3 17.25H11C11.1989 17.25 11.3897 17.329 11.5303 17.4697C11.671 17.6103 11.75 17.8011 11.75 18C11.75 18.1989 11.671 18.3897 11.5303 18.5303C11.3897 18.671 11.1989 18.75 11 18.75H3C2.80109 18.75 2.61032 18.671 2.46967 18.5303C2.32902 18.3897 2.25 18.1989 2.25 18Z" fill="#fff"/>
                                <path d="M18.875 14.118C20.529 15.073 21.355 15.551 21.477 16.239C21.5074 16.4113 21.5074 16.5876 21.477 16.76C21.356 17.45 20.529 17.927 18.875 18.882C17.221 19.837 16.395 20.314 15.737 20.075C15.5727 20.0153 15.42 19.9273 15.286 19.815C14.75 19.365 14.75 18.41 14.75 16.5C14.75 14.59 14.75 13.636 15.286 13.186C15.42 13.073 15.573 12.986 15.737 12.926C16.394 12.686 17.221 13.164 18.875 14.118Z" fill="#fff"/>
                            </svg>
                        </div>
                        <input onChange={(e) => {setSearchTerm(e.target.value)}} className={'bg-(--foreground) rounded-lg w-full p-4 text-white'} type='text' placeholder='What songs do you like?' />
                    </div>
                    { searchTerm ? (
                        <div className='flex-col gap-2 grow overflow-y-auto pr-4'>
                            {searchResults.map((track : SearchResults) => (<Track key={track.uri} id={track.uri} name={track.name} artist={track.artists.map((artist : Artist) => artist.name).join(', ')} image={track.album.images[0].url} onClick={addTrack} />))}
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2 grow items-center justify-center'>
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 1.99902L12.041 2.00102L12.249 2.00402C14.2835 2.06741 16.2174 2.90396 17.6567 4.34329C19.0961 5.78262 19.9326 7.71649 19.996 9.75102L19.999 9.99902L20.176 10.005C20.9096 10.0481 21.6019 10.3589 22.1215 10.8785C22.6411 11.3982 22.9519 12.0904 22.995 12.824L23 13C23 13.7957 22.6839 14.5587 22.1213 15.1213C21.5587 15.684 20.7956 16 20 16L19.999 17.696L21.832 20.446C21.927 20.5887 21.9838 20.7534 21.9968 20.9243C22.0098 21.0952 21.9787 21.2666 21.9064 21.4221C21.8341 21.5775 21.7231 21.7117 21.584 21.8119C21.4449 21.9121 21.2823 21.9748 21.112 21.994L21 22H11C7.555 22.002 4.673 19.51 4.099 16.176L4.071 15.998L4 15.999C3.23479 15.9991 2.49849 15.7067 1.94174 15.1817C1.38499 14.6568 1.04989 13.9389 1.005 13.175L1 13C1 12.2044 1.31607 11.4413 1.87868 10.8787C2.44129 10.3161 3.20435 10 4 10L4.004 9.75002C4.06895 7.67261 4.93985 5.70203 6.4323 4.25549C7.92474 2.80896 9.92157 2.00005 12 2.00002V1.99902ZM12 12C11.4696 12 10.9609 12.2107 10.5858 12.5858C10.2107 12.9609 10 13.4696 10 14C10 14.2652 10.1054 14.5196 10.2929 14.7071C10.4804 14.8947 10.7348 15 11 15H13C13.2652 15 13.5196 14.8947 13.7071 14.7071C13.8946 14.5196 14 14.2652 14 14C14 13.4696 13.7893 12.9609 13.4142 12.5858C13.0391 12.2107 12.5304 12 12 12ZM10.01 8.00002L9.883 8.00702C9.6299 8.03713 9.39785 8.16274 9.23426 8.35819C9.07067 8.55364 8.98789 8.80419 9.00283 9.05863C9.01776 9.31307 9.1293 9.55221 9.31463 9.72718C9.49997 9.90214 9.74512 9.99974 10 10L10.127 9.99302C10.3801 9.96292 10.6121 9.83731 10.7757 9.64186C10.9393 9.4464 11.0221 9.19586 11.0072 8.94142C10.9922 8.68698 10.8807 8.44784 10.6954 8.27287C10.51 8.0979 10.2649 8.00031 10.01 8.00002ZM14.01 8.00002L13.883 8.00702C13.6299 8.03713 13.3979 8.16274 13.2343 8.35819C13.0707 8.55364 12.9879 8.80419 13.0028 9.05863C13.0178 9.31307 13.1293 9.55221 13.3146 9.72718C13.5 9.90214 13.7451 9.99974 14 10L14.127 9.99302C14.3801 9.96292 14.6121 9.83731 14.7757 9.64186C14.9393 9.4464 15.0221 9.19586 15.0072 8.94142C14.9922 8.68698 14.8807 8.44784 14.6954 8.27287C14.51 8.0979 14.2649 8.00031 14.01 8.00002Z" fill="white"/>
                            </svg>
                            <h2>Who Got AUX?</h2>
                            <p>Search a song to get started!</p>
                        </div>
                    )}           
                </div>
            </div>
        </section>
        </Suspense>
    )
}