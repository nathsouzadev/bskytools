'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';

interface Post {
  id: number;
  content: string;
}

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const charLimit = 300;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length <= charLimit) {
      setText(newText);
    }
  };

  const handlePost = () => {
    if (text.trim()) {
      const newPost: Post = {
        id: Date.now(),
        content: text,
      };
      setPosts((prevPosts) => [...prevPosts, newPost]); // Add new post to the end
      setText(''); // Clear the textarea after posting
    }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditText(post.content);
  };

  const handleSave = (id: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              content: editText,
              timestamp: new Date().toLocaleString() + ' (edited)',
            }
          : post,
      ),
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handlePublish = async () => {
    if (!userName || !password) {
      alert('Informe suas credenciais para publicar os posts');
      setShowLogin(true);
      return;
    }

    try {
      textareaRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
      const response = await fetch('/api/bsky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posts: posts.map((post) => post.content),
          username: userName,
          password,
        }),
      });

      alert('Posts published successfully');
    } catch (error) {
      alert('An error occurred while publishing the posts');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className='flex flex-col min-h-screen'>
      <nav className='bg-primary text-primary-foreground p-4'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>ThreadSky</h1>
          <div className='flex space-x-4'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='py-1'
            >
              <svg
                className='w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
                x='0px'
                y='0px'
                width='100'
                height='100'
                viewBox='0 0 30 30'
              >
                <path d='M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z'></path>
              </svg>
            </a>
            <Button
              variant='ghost'
              className='py-4 border border-[#fff]/50'
              onClick={() => {
                setShowLogin(!showLogin);
              }}
            >
              {showLogin ? 'Close' : 'Login'}
            </Button>
          </div>
        </div>
      </nav>

      <main className='flex-grow container mx-auto p-4'>
        <div className='w-full max-w-2xl mx-auto space-y-8'>
          {showLogin && (
            <div className='flex items-center justify-center px-4'>
              <Card>
                <CardHeader>
                  <CardDescription>
                    Informe suas credenciais do BlueSky. Não salvamos as
                    credenciais.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Input
                      id='username'
                      type='username'
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder='username.bsky.social'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full'
                    onClick={() => {
                      if (!userName || !password) {
                        alert(
                          'Informe suas credenciais para publicar os posts',
                        );
                        return;
                      }

                      setShowLogin(false);
                    }}
                  >
                    Salvar
                  </Button>
                </CardContent>
                <CardFooter className='text-center'>
                  <Link
                    href='https://bsky.app/settings/app-passwords'
                    className='text-sm underline'
                    prefetch={false}
                  >
                    Gere uma credencial diferente de sua senha principal
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}

          <div className='space-y-4'>
            <Textarea
              ref={textareaRef}
              placeholder='Type your message here...'
              value={text}
              onChange={handleTextChange}
              className='min-h-[100px]'
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handlePost();
                }
              }}
            />
            <div className='flex justify-between items-center'>
              <span
                className={`text-sm ${
                  text.length === charLimit ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {text.length}/{charLimit}
              </span>
              <Button onClick={handlePost} disabled={text.trim().length === 0}>
                Add to thread
              </Button>
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Posts thread</h2>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className='pt-6'>
                  {editingId === post.id ? (
                    <div className='space-y-4'>
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className='min-h-[100px]'
                      />
                      <div className='flex justify-end space-x-2'>
                        <Button
                          onClick={() => handleSave(post.id)}
                          disabled={editText.trim().length === 0}
                        >
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant='outline'>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className='mb-2'>{post.content}</p>
                      <div className='flex justify-end items-center'>
                        <Button
                          onClick={() => handleEdit(post)}
                          variant='outline'
                          size='sm'
                        >
                          Edit
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button
              className='w-full'
              disabled={posts.length === 0}
              onClick={handlePublish}
            >
              Publish on Bsky
            </Button>
          </div>
        </div>
      </main>
      <footer className='container mx-auto text-center p-4'>
        <p className='text-sm'>
          Developed by{' '}
          <Link
            className='text-blue-400'
            href='https://bsky.app/profile/nathsouzadev.bsky.social'
          >
            Nathally Souza
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default Home;
