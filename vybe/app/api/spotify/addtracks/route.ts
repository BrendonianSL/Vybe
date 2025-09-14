import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body.
    const { playlistID, tracks, token } = await req.json();

    // Send information to the Spotify API.
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uris: tracks, // must be an array of track URIs
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error, status: response.status },
        { status: response.status }
      );
    }

    // Success (Spotify responds with 201).
    return NextResponse.json({ message: 'Tracks added', status: 201 }, { status: 201 });
  } catch (err: unknown) {
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

}
