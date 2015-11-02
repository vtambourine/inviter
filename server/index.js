import path from 'path';

// Include Koa server and related tools
import Koa from 'koa';
import Router from 'koa-router';
import views from 'koa-views';
import serve from 'koa-static';

// Require storage accessor
import {getGuests} from './storage';

const cwd = process.cwd();
const app = new Koa();
const router = new Router();

app.use(views('views', {
  map: {html: 'jade'}
}));

router.get('/', async function(ctx) {
  var guests = await getGuests();
  ctx.render('index', {guests});
});

app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files from `dist` directory
app.use(serve(path.join(cwd, 'dist')));

app.use(ctx => {
  ctx.body = '<h1>404</h1>';
});

app.listen(3000, function() {
  console.log('Listening at port 3000');
});
