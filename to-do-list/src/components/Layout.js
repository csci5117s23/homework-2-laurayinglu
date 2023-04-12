import Sidebar from './Sidebar/Sidebar';
import styles from './layout.module.css';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from '@clerk/nextjs';

export default function Layout({ children }) {

  const router = useRouter();

  const { user } = useUser();
  useEffect(() => {
    // Redirect to '/' page 
    if (!user) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  return (
    <>
      {/* <Head>
        <title>Ying's To Do List</title>
        <meta name="description" content="Ying's To Do List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      
      <SignedIn>
        <div>
          <div className={styles.sideBar}>
            <Sidebar />
          </div>
          
          <main className={styles.main}>
            {children}
          </main>      
        </div>
      </SignedIn>

    </>
  )
}