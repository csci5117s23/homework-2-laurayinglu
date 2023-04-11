import todosStyle from '@/styles/Todos.module.css';
import Checkbox from '@mui/material/Checkbox';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { deleteTodo, getTodoItems, updateTodo, getDoneItems } from "@/modules/Data";
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function ListItem({ item, setTodoItems, hasCheck}) {
  const [jwt, setJwt] = useState('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        if (hasCheck)
          setTodoItems(await getTodoItems(token, userId));
        else 
          setTodoItems(await getDoneItems(token, userId));
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
    
    if(hasCheck) 
      setTodoItems(await getTodoItems(jwt, userId));
    else 
      setTodoItems(await getDoneItems(jwt, userId));
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

    setTodoItems(await getTodoItems(jwt, userId));
  }

  // go to /todo/id
  function gotoItem(id) {
    window.location.href = `/todo/${id}`;
  }

  return (
    <div key={item._id} className={todosStyle.showItem} onClick={() => gotoItem(item._id)}>
      {hasCheck && <Checkbox onClick={(e) => checkItem(e, item._id, item.category, item.itemDesc, true)} />}  
      {item.itemDesc}
      <HighlightOffIcon onClick={(e) => deleteItem(e, item._id)} className={todosStyle.deletebtn} />
    </div>
  )
}