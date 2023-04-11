import TodoItems from '@/components/TodoItems';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout.js'

// this is the endpoint "/todos"
export default function Home() {
  return (
    <Layout>
      <TodoItems ></TodoItems>
    </Layout>
  )
}