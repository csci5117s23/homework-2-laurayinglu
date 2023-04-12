
import Layout from '@/components/Layout.js';
import { useEffect, useState } from 'react';
import { updateTodo, deleteTodo, getTodoItem } from "@/modules/Data";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
// import { useRouter } from 'next/navigation';
import indItem from '@/styles/IndividualItem.module.css';


export default function ToDoItem() {

  const router = useRouter();
  // get item id
  const { id } = router.query; 
  const { isLoaded, userId,  getToken } = useAuth();

  // jwt token
  const [jwt, setJwt] = useState('');
  const [currItem, setCurrItem] = useState('');
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedCat, setUpdatedCat] = useState("");
  const [updatedDone, setUpdatedDone] = useState(false);

  useEffect(() => {
    async function process() {
      if (userId) {
        const token = await getToken({ template: "codehooks" });
        setJwt(token);
        setCurrItem(await getTodoItem(token, id));
      }
    }
    process();
  }, [userId, jwt]);

  // assign values of curritem to the updatedContent
  useEffect(() => {
    if (currItem) {
      setUpdatedContent(currItem.itemDesc);
      setUpdatedCat(currItem.category);
      setUpdatedDone(currItem.done);

      if (currItem.category == null) {
        setUpdatedCat('');
      } else {
        setUpdatedCat(currItem.category);
      }
    }
  }, [currItem]);


  function goBack() {
    window.location.href = `/todos`;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (currItem) {
      await updateTodo(
        jwt,
        userId,
        id,
        updatedCat,
        updatedContent,
        updatedDone
      );
    }
    if (updatedDone)
      router.push('/done');
      // window.location.href=`/done`;
    else
      router.push('/todos');
      //window.location.href=`/todos`;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteTodo(jwt, id);
    router.push('/todos');
    //window.location.href=`/todos`;
  };

  return (
    <Layout>
      <button type="button" className={indItem.backbtn} onClick={() => goBack()}> 
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 -4 20 20">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
        </svg>
        <p className={indItem.back}>View all To-Do-Items</p>
      </button>

      <div>
        <div className={indItem.form}>
          <h1>Edit the To Do Item</h1>
          <form method="POST">

            <label className={indItem.label} for="content">Item Description: </label>
            <input 
              className={indItem.contentInput}
              type="text" 
              id="content"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Add A Task..." required
            />

            <label className={indItem.label} for="cat">Item Category: </label>
            <input 
              className={indItem.catInput}
              type="text" 
              id="cat"
              value={updatedCat}
              onChange={(e) => setUpdatedCat(e.target.value)}
              placeholder="Add A Task..." required
            />

            <br></br>

            <label className={indItem.labelDone} for="cat">Mark as Done </label>
            <input 
              className={indItem.check}
              type="checkbox" 
              id="done"
              name="done" 
              onChange={ () => {setUpdatedDone(!updatedDone)} }
              checked={updatedDone}
            />

            <br></br>

            <button className={indItem.updatebtn} onClick={(e) => handleUpdate(e)} > Update </button>
            <button className={indItem.deletebtn} onClick={(e) => handleDelete(e)} > Delete this Item </button>

          </form>
        </div>

        
      </div>
    </Layout>
  )
}