
import todosStyle from '@/styles/Todos.module.css';
import catItemStyle from '@/styles/catItem.module.css';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { addItem, getDoneByCat, getTodoByCat  } from "@/modules/Data";
import { useAuth } from '@clerk/nextjs';
import ListItem from '../components/listItem';

// filtered by category and done or not
export default function CatItem({ cat, done, getCatMethod, hasCheckBox }) {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, getToken } = useAuth();
  const [content, setContent] = useState('');

  // jwt token
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        
        if (done) {
          setItems(await getDoneByCat(token, userId, cat));
        } else {
          setItems(await getTodoByCat(token, userId, cat));
        }
        setLoading(false);
      }
    }
    process();
  }, [userId, jwt]);


  // add the new item
  // also add the current ategory 
  async function add() {
    try {
      const todo = {
        userId: userId,
        itemDesc: content,
        category: cat
      }
      const newItem = await addItem(jwt, todo);
      console.log(newItem);
      setContent('');

      setItems([...items, newItem]);
    } catch (e) {
      console.log(e);
    }
    
  }

  // handle add item input change
  const handleInput = (e) => {
    setContent(e.target.value);
  }


  if(loading) {
    return (<span>loading...</span>);
  } else {
    let todoListItems = [];
    if (items.length > 0) {
      todoListItems = items.map((item) => (
        <ListItem key={item._id} item={item} setMethod={setItems} getMethod={getCatMethod} filterBycat={true} cat={cat} hasCheck={hasCheckBox}/>
      ));
    }

    return (
      <>
        <div className={todosStyle.showItems}>

          <h2 style={{ margin: '.5em' }}>All Items belong to {cat} Category </h2>
          <ol>
            {todoListItems}
          </ol>
        </div> 

        <div className={todosStyle.containerWarp}>
          <div className={todosStyle.inputContainer}>
            <AddIcon style={{ color: "white" }}/>
            <form className={todosStyle.inputForm} method="POST">
              <input className={catItemStyle.item} onChange={handleInput} onKeyDown = {(e)=>{if (e.key === 'Enter'){add()}}} type="text" value={content || ""} name="itemDesc" id="taskInput" placeholder="Add A Task..." required/>
              <Button onClick={add} sx={{ padding: ".6em 2em",  float: "right" }} variant="contained">Add</Button>
            </form>
          </div>
        </div>

      </>
    )
  }
}