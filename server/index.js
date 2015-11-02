// Include Koa server and related tools
import Koa from 'koa';
import Router from 'koa-router';
import views from 'koa-views';
// import serve from 'koa-static';
const app = new Koa();
const router = new Router();

// // Include Redis and co wrapper
// import Redis from 'redis';
// import coRedis from 'co-redis';
// var redis = coRedis(Redis.createClient());

app.use(views('views', {
  map: {html: 'handlebars'}
}));

// Key to guest records in Redis database
var GUESTS_SET = 'thursday:guests';
var IMAGES_HASH = 'thursday:images';

router.get('/', function*(next) {
  var names = yield redis.smembers(GUESTS_SET);
  var images = yield redis.hgetall(IMAGES_HASH);

  var guests = names.map(function(name) {
    return {
      name: name,
      image: images[name]
    };
  });

  for (let i = guests.length; i < 12; i++) {
    guests.push({
      name: ''
    });
  }

  yield this.render('index', {guests: guests});
});

app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files from `dist` directory
app.use(serve('dist'));

app.use(function*() {
  this.body = '<h1>404</h1>';
});

app.listen(3000, function() {
  console.log('Listening at port 3000');
});
