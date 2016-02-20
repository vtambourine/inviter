const path = require('path');

// Include Koa server and related tools
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const serve = require('koa-static');

// Require storage accessor
const getGuests = require('./storage').getGuests;

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
