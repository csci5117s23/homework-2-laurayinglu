import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import React, { useEffect, useState } from 'react';
import todosStyle from '@/styles/Todos.module.css';

import { deleteTodo, getTodoItems, getDoneItems } from "@/modules/Data";
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Layout from '@/components/Layout.js';
import ListItem from '../components/listItem';

// this is the endpoint "/todos"
export default function TodoItems() {

  const [doneItems, setDoneItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  // jwt token
  const [jwt, setJwt] = useState('');
  const router = useRouter();


  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        setDoneItems(await getDoneItems(token, userId));
        setLoading(false);
      }
    }
    process();
  }, [userId, jwt]);


  if(loading) {
    return (<span>loading...</span>);
  } else {

    const allDoneItems = doneItems.map((item) => (
      <ListItem item={item} setTodoItems={setDoneItems} hasCheck={false} />
    ));

    return (
      <Layout>
        <Head>
          <title>Ying's To Do List</title>
          <meta name="description" content="Ying's To Do List" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={todosStyle.showItems}>
          <h2 style={{ margin: '.5em' }}>All Completed Items</h2>
          <ol>
            {allDoneItems}
          </ol>
        </div> 

      </Layout>
    )
  }
}