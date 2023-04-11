import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@mui/material';


import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] })

// this is the endpoint "/"
export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Redirect to '/todos' page 
    if (user) {
      const timer = setTimeout(() => {
        router.push('/todos');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>Ying's To Do List</title>
        <meta name="description" content="Ying's To Do List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} >
        <div className={styles.center}>
          Ying's To Do List App 
        </div>

        <SignedIn>
          <p className={styles.fadeInOut}>Welcome, {user?.firstName}!</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <UserButton />
            </div>

          {/* <Link href='/todos'>
            <Button variant='primary'>Go to the To Do List</Button>
          </Link> */}

        </SignedIn>

        <SignedOut>
          <div>
            Please log in first.
            <SignInButton className={styles.card} />
          </div>
          
        </SignedOut>

      </main>
    </>
  )
}

