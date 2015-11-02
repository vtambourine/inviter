import path from 'path';
import express from 'express';
import * as engines from 'consolidate';
import {getGuests} from './storage';

const cwd = process.cwd();
const app = express();

app.engine('jade', engines.jade);
app.set('views', path.join(cwd, 'views'));
app.set('view engine', 'jade');

// Render index template with the data passed from DB accessor
app.get('/', async function(request, response) {
  var guests = await getGuests();
  return response.render('index', {guests});
});

// Serve static files from `dist` directory
app.use(express.static(path.join(cwd, 'dist')));

app.use((request, response) => {
  response.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Application is listening at port 3000');
});
