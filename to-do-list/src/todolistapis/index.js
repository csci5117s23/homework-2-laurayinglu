
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string, number, boolean} from 'yup';
import jwtDecode from 'jwt-decode';

// to do list items: /toDoItems
const toDoItemsYup = object({
  userId: string().required(),
  itemDesc: string().required().default('Todo Item'),
  category: string().nullable(),
  done: boolean().default(false),
  createdOn: date().default(() => new Date()),
})

const categoriesYup = object({
  userId: string().required(),
  name: string().required(),
  createdOn: date().default(() => new Date()),
})

const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  } 
}
app.use(userAuth)


async function getToDoItems(req, res) {
  const userId = req.user_token.sub;
  // const userId = req.params.userId;
  const conn = await Datastore.open();  
  const query = {"userId": userId, "done": false };
  const options = {
    filter: query,
    sort: {'createdOn' : 0},
  }  
  conn.getMany('toDoItems', options).json(res);  
}

app.get('/getAlltoDoItems', getToDoItems);



crudlify(app, {toDoItems: toDoItemsYup, categories: categoriesYup})

// bind to serverless runtime
export default app.init();