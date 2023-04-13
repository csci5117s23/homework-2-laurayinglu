const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/** GET REQUESTS **/

// get all items of the current user
export async function getItems(authToken, userId) {
  console.log(userId);

  const result = await fetch(`${backend_base}/toDoItems?userId=${userId}`, {
      'method':'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  });

  console.log(JSON.stringify(result));
  return await result.json();
}

// get a specific to do list item by item id
// item id is unique
export async function getTodoItem(authToken, todoId) {
  const result = await fetch(`${backend_base}/toDoItems/${todoId}`, {
      'method':'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  })
  return await result.json();
}

// get to do items of current user by time desc
export async function getTodoItems(authToken, userId) {
  const result = await fetch(`${backend_base}/getAlltoDoItems`, {
      'method':'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  });
  return await result.json();
}

// get done items of current user
export async function getDoneItems(authToken, userId) {
  const result = await fetch(`${backend_base}/toDoItems?userId=${userId}&done=true`, {
      'method':'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  });
  return await result.json();
}

// get categories of current user
export async function getAllCats(authToken, userId) {
  const response = await fetch(`${backend_base}/categories?userId=${userId}`, {
      method:'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  });

  if (!response.ok) {
    console.log("error fetching");
    const errorData = await response.json();
    console.error('Error fetching categories:', errorData);
    throw new Error('Failed to fetch categories');
  }

  return await response.json();
}

// get to do items by category
export async function getTodoByCat(authToken, userId, cat) {
  try {
    const response = await fetch(`${backend_base}/toDoItems?userId=${userId}&done=false&category=${cat}`, 
    {
        method:'GET',
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${authToken}`,
        },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching todos by category:', errorData);
      throw new Error('Failed to fetch todos by category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getTodoByCat function:', error);
    throw error;
  }

}


// get done items by category
export async function getDoneByCat(authToken, userId, cat) {
  const response = await fetch(`${backend_base}/toDoItems?userId=${userId}&done=true&category=${cat}`, {
      method:'GET',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`,
      },
  })
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error fetching done by category:', errorData);
    throw new Error('Failed to fetch done items by category');
  }
  
  console.log(JSON.stringify(response));
  return await response.json();
}


/** POST REQUESTS **/

// add a new item
export async function addItem(authToken, todo) {
  const response = await fetch(`${backend_base}/toDoItems`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json', // Ensure the Content-Type header is set
      Authorization: `Bearer ${authToken}`, // Add the JWT token to the request header
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error adding new todo:', errorData);
    throw new Error('Failed to adding new todo');
  }

  return await response.json();
}

// add a new category
export async function addCat(authToken, cat) {
  const response = await fetch(`${backend_base}/categories`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json', // Ensure the Content-Type header is set
      Authorization: `Bearer ${authToken}`, // Add the JWT token to the request header
    },
    body: JSON.stringify(cat),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error adding new todo:', errorData);
    throw new Error('Failed to adding new todo');
  }

  return await response.json();
}

/** DELETE REQUESTS **/

// delete an item by _id
export async function deleteTodo(authToken, id) {
  try {
    // Check if the 'id' parameter is defined
    if (!id) {
      throw new Error('Todo ID is required for updating');
    }
    const response = await fetch(`${backend_base}/toDoItems/${id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`, // Add the JWT token to the request header
      },
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting todo:', errorData);
      throw new Error('Failed to delete todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteTodo function:', error);
    throw error;
  }
}

/** DELETE REQUESTS **/

// delete an category by id
export async function deleteCat(authToken, id) {
  try {
    // Check if the 'id' parameter is defined
    if (!id) {
      throw new Error('category ID is required for updating');
    }
    const response = await fetch(`${backend_base}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
        Authorization: `Bearer ${authToken}`, // Add the JWT token to the request header
      },
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error deleting todo:', errorData);
      throw new Error('Failed to delete todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in deleteTodo function:', error);
    throw error;
  }
}

/** PUT **/

// update an item's content
// edit item
export async function updateTodo(authToken, userId, id, category, content, done) {
  try {
    // Check if the 'id' parameter is defined
    if (!id) {
      throw new Error('Todo ID is required for updating');
    }
    const createdOn = new Date().toISOString(); // Get the current date and time
    const response = await fetch(`${backend_base}/toDoItems/${id}`, {
      method: 'PUT',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Add the JWT token to the request header
      },
      body: JSON.stringify({
        userId: userId,
        itemDesc: content,
        category: category,
        done: done,
        createdOn: createdOn,
      }),
    });

    // Check if the response status code indicates success
    if (!response.ok) {
      // Check if the response has a JSON body
      const contentType = response.headers.get('content-type');
      let errorData;
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
      console.error('Error updating todo:', errorData);
      throw new Error('Failed to update todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateTodo function:', error);
    throw error;
  }
}
