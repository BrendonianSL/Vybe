import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id, name, description, token } = await req.json();

    const response = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        public: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error, status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch (err: unknown) {
  let message = "Internal Server Error";

  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

}
