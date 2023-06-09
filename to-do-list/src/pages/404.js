import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react'


// this is the endpoint "/todos"
export default function Home() {

  function gotoTodo(cat) {
    // e.preventDefault();
    window.location.href = `/todos`;
  }
  return (
    <>
      <Head>
        <title>Ying's To Do List</title>
        <meta name="description" content="Ying's To Do List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        The page is Not Found. 
        <button onClick={gotoTodo}>Go Back to Todos</button>
      </div>
    </>
  )
}