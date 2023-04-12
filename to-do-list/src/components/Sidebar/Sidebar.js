
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
import { Button } from '@mui/material';

import sideBarStyle from './sidebar.module.css';
import { getItems, getAllCats, getTodoItems } from "@/modules/Data";
import styles from '@/styles/Home.module.css'
import Link from 'next/link';

export default function Sidebar() {

  const [openTodoCat, setTodoOpenCat] = useState(true);
  const [openDoneCat, setDoneOpenCat] = useState(true);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [jwt, setJwt] = useState('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const { user } = useUser();


  useEffect(() => {
    async function fetchTodos() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        setItems(await getTodoItems(token, userId));
      }
    }
    fetchTodos();
  }, [userId, jwt]);

  useEffect(() => {
    // console.log(items);
    const cats = [...new Set(items.map((item) => item.category))];
    console.log(cats);
    setCategories(cats);
  }, [items]);

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
                  <ListItemButton key={cat._id} sx={{ pl: 12 }} href={`/todos/${cat}`}>
                    <ListItemText primary={cat} />
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
                  <ListItemButton key={cat._id} sx={{ pl: 12 }} href={`/done/${cat}`}>
                    <ListItemText primary={cat} />
                  </ListItemButton>
                ))
              }
            </List>
          </Collapse>
        </List>

      </List>
  )
}