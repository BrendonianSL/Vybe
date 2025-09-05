import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Destructure values fromt he response.
    const { refresh_token } = await req.json();

    // Makes a request to the server.
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST', // Because we are sending data to the server.
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // This means the request body is coded like a query string.
            'Authorization': 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_CLIENTID}:${process.env.CLIENTSECRET}`) // BTOA encodes our authorization in base 64.
        },
        body: new URLSearchParams({
            'grant_type': 'refresh_token', // We are requesting a refresh token.
            'refresh_token': refresh_token,
            // Add The Client ID Later.
        })
    });

    // Check the response.
    if(!response.ok) {
        // Send a error code to the user.
        return NextResponse.json({ error: `Couldn't fetch access token`, status: 500});
    }

    // If successful, parse the response.
    const data = await response.json();

    // Return the response.
    return NextResponse.json({ data: data });
}