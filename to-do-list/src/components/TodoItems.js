
import Head from 'next/head';
import todosStyle from '@/styles/Todos.module.css';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import bg from '../../public/n2.jpeg';
import { useEffect, useState } from 'react';
import { addItem, addCat, deleteTodo, getTodoItems, updateTodo, markTodoAsDone } from "@/modules/Data";
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';

import ListItem from '../components/listItem';

// this is the endpoint "/todos"
export default function TodoItems() {

  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  const [inputFormData, setInputFormData] = useState({
    itemDesc: "",
    category: "",
  });

  // jwt token
  const [jwt, setJwt] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        setTodoItems(await getTodoItems(token, userId));
        setLoading(false);
      }
    }
    process();
  }, [userId, jwt]);


  // add the new item
  // also add the category if it's the new category
  async function add() {
    try {
      const todo = {
        userId: userId,
        itemDesc: inputFormData.itemDesc,
        category: inputFormData.category,
      }

      const newItem = await addItem(jwt, todo);
      console.log(newItem);
      setInputFormData({
        itemDesc: "",
        category: "",
      });

      setTodoItems([...todoItems, newItem]);
    } catch (e) {
      console.log(e);
    }
    
  }

  // handle add item input change
  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    setInputFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }


  if(loading) {
    return (<span>loading...</span>);
  } else {
    const todoListItems = todoItems.map((item) => (
      <ListItem key={item._id} item={item} setMethod={setTodoItems} getMethod={getTodoItems} filterBycat={false} hasCheck={true} />
    ));

    return (
      <>
        <div className={todosStyle.showItems}>
          <h2 style={{ margin: '.5em' }}>All To Do Items</h2>
          <ol>
            {todoListItems}
          </ol>
        </div> 

        <div className={todosStyle.containerWarp}>
          <div className={todosStyle.inputContainer}>
            <AddIcon style={{ color: "white" }}/>
            <form className={todosStyle.inputForm} method="POST">
              <input className={todosStyle.item} onChange={handleInput} onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}} type="text" value={inputFormData.itemDesc || ""} name="itemDesc" id="taskInput" placeholder="Add A Task..." required/>
              <input className={todosStyle.item} onChange={handleInput} onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}} type="text" value={inputFormData.category || ""} name="category" id="catInput" placeholder="Add A Category..."/>
              <Button onClick={add} sx={{ padding: ".6em 2em",  float: "right" }} variant="contained">Add</Button>
            </form>
          </div>
        </div>

      </>
    )
  }
}