
import Head from 'next/head';
import todosStyle from '@/styles/Todos.module.css';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

import { useEffect, useState } from 'react';
import { addItem, addCat, deleteTodo, getTodoItems, updateTodo, getAllCats } from "@/modules/Data";
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';

import ListItem from '../components/listItem';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


// this is the endpoint "/todos"
export default function TodoItems() {

  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [cats, setCats] = useState([]);

  const [inputFormData, setInputFormData] = useState({
    itemDesc: "",
    category: "",
  });

  const [newItemContent, setNewItemContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  // jwt token
  const [jwt, setJwt] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        console.log(token);
        setJwt(token);
        setTodoItems(await getTodoItems(token, userId));
        setCats(await getAllCats(token, userId));
        setLoading(false);
      }
    }
    process();
  }, [userId, jwt]);

  // useEffect(() => {
  //   console.log("cats", selectedCategory);
  // });


  // add the new item
  // also add the category if it's the new category
  async function add() {
    try {
      const todo = {
        userId: userId,
        itemDesc: newItemContent,
        category: selectedCategory,
      }

      const newItem = await addItem(jwt, todo);
      console.log(newItem);
      setNewItemContent('');
      setSelectedCategory('');
      setTodoItems([newItem, ...todoItems]);

    } catch (e) {
      console.log(e);
    }
    
  }

  // handle add item input change
  const handleInput = (e) => {
    setNewItemContent(e.target.value);
  }

  // handle selected category change
  const handleSelectCat = (e) => {
    setSelectedCategory(e.target.value);
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
              <input className={todosStyle.item} onChange={handleInput} onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}} type="text" value={newItemContent || ""} name="itemDesc" id="taskInput" placeholder="Add A Task..." required/>
              
              {/* <input className={todosStyle.item} onChange={handleInput} onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}} type="text" value={inputFormData.category || ""} name="category" id="catInput" placeholder="Add A Category..."/> */}
              <select 
                value={selectedCategory} 
                onChange={handleSelectCat} 
                name = "cat-dropdown"
                className={todosStyle.dropdown}
              >
                {cats.map((cat) => (
                  <option value={cat.name}>{cat.name}</option>
                ))
                }
              </select>

              <Button onClick={add} sx={{ padding: ".6em 2em",  float: "right" }} variant="contained">Add</Button>
            </form>
          </div>
        </div>

      </>
    )
  }
}