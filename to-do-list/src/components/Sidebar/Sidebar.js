
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Divider from '@mui/material/Divider';
import ChecklistIcon from '@mui/icons-material/Checklist';

import { useAuth, SignInButton, UserButton, useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import sideBarStyle from './sidebar.module.css';
import { addCat, getAllCats, getTodoItems, deleteCat } from "@/modules/Data";
import styles from '@/styles/Home.module.css'


export default function Sidebar() {

  const [openTodoCat, setTodoOpenCat] = useState(true);
  const [openDoneCat, setDoneOpenCat] = useState(true);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [jwt, setJwt] = useState('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();
  const [newCat, setNewCat] = useState('');


  useEffect(() => {
    async function fetchTodos() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        setItems(await getTodoItems(token, userId));
        setCategories(await getAllCats(token, userId));
      }
    }
    fetchTodos();
  }, [userId, jwt]);

  // useEffect(() => {
  //   // console.log(items);
  //   const cats = [...new Set(items.map((item) => item.category))];
  //   console.log(cats);
  //   setCategories(cats);
  // }, [items]);

  const handleClickTodoCat = () => {
    setTodoOpenCat(!openTodoCat);
  };

  const handleClickDoneCat = () => {
    setDoneOpenCat(!openDoneCat);
  };

  const listStyles = {
    height: '100vh', 
    bgcolor: 'background.paper',
    borderRight: '.5px solid grey',
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(174, 165, 232, 0.2)'
  };

  const handleDeleteCat = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteCat(jwt, id);
    setCategories(await getAllCats(jwt, userId));
  }

  const handleInput = (e) => {
    const newCatName = e.target.value;
    setNewCat(newCatName);
  }

  async function addCategory(e) {
    // e.preventDefault();
    try {
      const cat = {
        userId: userId,
        name: newCat
      }

      const newCate = await addCat(jwt, cat);
      console.log(newCate);
      setCategories([...categories, newCate]);
      setNewCat("");
    } catch (e) {
      console.log(e);
    }
  }

  // go to /todo/:category
  function gotoTodoCat(e, cat) {
    e.preventDefault();
    window.location.href = `/todos/${cat}`;
  }

  // go to /todo/:category
  function gotoDoneCat(e, cat) {
    e.preventDefault();
    window.location.href = `/done/${cat}`;
  }


  return (
      <List
        sx={listStyles}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <ListItemIcon>
            <UserButton  /> 
              <p className={sideBarStyle.user}>Welcome {user?.firstName}!</p>
              <SignOutButton className={sideBarStyle.signout}/>
            </ListItemIcon>
          </ListSubheader>
        }
      >
        
        <Divider />
        <ListItemButton key="all-to-do" href="/todos">
          <ListItemIcon>
            <FormatListBulletedIcon style={{ color: "white" }}/>
          </ListItemIcon>
          <ListItemText primary="All To-Do-Items" />
        </ListItemButton>

        <List component="div" disablePadding>
          <ListItemButton key="all-cat" sx={{ pl: 4 }} onClick={handleClickTodoCat}>
            <ListItemIcon>
              <AppsIcon style={{ color: "white" }}/>
            </ListItemIcon>
            <ListItemText  primary="All Categories" />
            {openTodoCat ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openTodoCat} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                categories.map((cat) => (
                  <ListItemButton key={cat._id} sx={{ pl: 12 }} onClick={(e) => gotoTodoCat(e, cat.name)} >
                    <ListItemText primary={cat.name} />
                    <button className={sideBarStyle.deleteCatBtn} type="button" onClick={(e) => handleDeleteCat(e, cat._id)}> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
                      </svg>
                    </button>
                  </ListItemButton>
                ))
              }
            </List>
          </Collapse>
        </List>

        <Divider sx={{ color: "white" }}/>

        <ListItemButton key="all-done" href="/done">
            <ListItemIcon>
              <ChecklistIcon style={{ color: "white" }}/>
            </ListItemIcon>
            <ListItemText primary="Completed Items" />
        </ListItemButton>

        <List component="div" disablePadding>
          <ListItemButton key="all-done-cats" sx={{ pl: 4 }} onClick={handleClickDoneCat}>
            <ListItemIcon>
              <AppsIcon style={{ color: "white" }}/>
            </ListItemIcon>
            <ListItemText primary="All Categories" />
            {openDoneCat ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openDoneCat} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {
                categories.map((cat) => (
                  <ListItemButton key={cat._id} sx={{ pl: 12 }} onClick={(e) => gotoDoneCat(e, cat.name)} >
                    <ListItemText primary={cat.name} />
                    <button className={sideBarStyle.deleteCatBtn} type="button" onClick={(e) => handleDeleteCat(e, cat._id)}> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/>
                      </svg>
                    </button>
                  </ListItemButton>
                ))
              }
            </List>
          </Collapse>
        </List>

        <Divider />
        
        {/* for user to add a new category */}
        <form method="POST">
          <input 
            className={sideBarStyle.catInput} 
            onChange={(e) => handleInput(e)} 
            type="text" 
            value={newCat} 
            placeholder="Add A Category..." required/>
          <button onClick={(e) => addCategory(e)} type="button" className={sideBarStyle.addCatBtn}>Add</button>
        </form>

      </List>
  )
}