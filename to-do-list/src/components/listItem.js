import todosStyle from '@/styles/Todos.module.css';
import Checkbox from '@mui/material/Checkbox';
import { deleteTodo, getTodoItems, updateTodo, getDoneItems } from "@/modules/Data";
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function ListItem({ item, setMethod, getMethod, filterBycat, cat, hasCheck }) {
  const [jwt, setJwt] = useState('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        if (filterBycat)
          setMethod(await getMethod(token, userId, cat));
        else
          setMethod(await getMethod(token, userId));
      }
    }
    process();
  }, [userId, jwt]);


  async function deleteItem(e, id) {
    e.stopPropagation();
    try {
      await deleteTodo(jwt, id);
    } catch (e) {
      console.log(e);
    }
    
    if (filterBycat)
      setMethod(await getMethod(jwt, userId, cat));
    else
      setMethod(await getMethod(jwt, userId));
  }

  // mark the item as done
  async function checkItem(e, id, cat, content, done) {
    e.stopPropagation();
    try {
      const newItem = await updateTodo(jwt, userId, id, cat, content, done);
      console.log(newItem);
    } catch (err) {
      console.log(err);
    }

    if (filterBycat)
      setMethod(await getMethod(jwt, userId, cat));
    else
      setMethod(await getMethod(jwt, userId));
  }

  // go to /todo/id
  function gotoItem(e, id) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/todo/${id}`;
  }

  return (
    <div key={item._id} className={todosStyle.showItem} onClick={(e) => gotoItem(e, item._id)}>
      {hasCheck && <Checkbox className={todosStyle.checkBox} onClick={(e) => checkItem(e, item._id, item.category, item.itemDesc, true)} />}  
      <p className={todosStyle.content}>{item.itemDesc}</p>
      <button onClick={(e) => deleteItem(e, item._id)} className={todosStyle.deletebtn} >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </div>
  )
}