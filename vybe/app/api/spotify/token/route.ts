import { NextResponse } from 'next/server';

// Exports an async function to fetch spotify data.
export async function POST(req: Request) {
    // Grabs the code from the request.
    const { code } = await req.json();

    // Creates parameters for the request in url encoded format.
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', 'http://127.0.0.1:3000/create');
    params.append('grant_type', 'authorization_code');

    // Start spotify api call.
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', // The method is POST because we are sending data.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CLIENTID}:${process.env.CLIENTSECRET}`)
        },
        body: params
    });

    // If the response is not ok, send an error code to the user.
    if(!response.ok) {
        // Sends a 500 error to client so client can display error message.
        return NextResponse.json({ error: `Couldn't fetch access token`, status: 500});
    }

    // Parses data from json formatting.
    const data = await response.json();

    // Returns data with status code.
    return NextResponse.json({ status: 200, data: data })
}

