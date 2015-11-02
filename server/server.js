import path from 'path';
import express from 'express';
import * as engines from 'consolidate';
import {users} from './storage';

const cwd = process.cwd();
const app = express();

app.engine('jade', engines.jade);
app.set('views', path.join(cwd, 'views'));
app.set('view engine', 'jade');

app.get('/', (request, response) => {
  users()
    .then(users => {
      console.log(users);
      response.render('index', {users});
    })
    .catch(error => {
      console.log(error.stack);
    });
});

app.use(express.static(path.join(cwd, 'dist')));

app.use((request, response) => {
  response.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Application is listening at port 3000');
});
