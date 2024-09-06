import { NextResponse } from 'next/server';
import { AtpAgent } from '@atproto/api';

const agent = new AtpAgent({
  service: 'https://bsky.social',
});

export async function POST (req: Request) {
  try {
    const body = await req.json();

    const { posts, username, password } = body;

    if (!posts || !username || !password) {
      return new NextResponse('Posts, username and password are required', {
        status: 400,
      });
    }

    await agent.login({
      identifier: username,
      password,
    });

    const created = [];

    const response = await agent.post({
      text: posts[0],
      createdAt: new Date().toISOString(),
    });

    created.push(response);
    console.log('[POST_CREATED]', response);

    for await (const post of posts.slice(1)) {
      const reply = await agent.post({
        reply: {
          root: {
            uri: response.uri,
            cid: response.cid,
          },
          parent: {
            uri: response.uri,
            cid: response.cid,
          },
        },
        text: post,
        createdAt: new Date().toISOString(),
      });

      created.push(reply);
      console.log('[REPLY_CREATED]', reply);
    }

    return NextResponse.json({ created });
  } catch (error: any) {
    console.log('[POST_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
