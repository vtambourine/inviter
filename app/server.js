// Include Koa server and related tools
var koa = require('koa');
var views = require('koa-views');
var router = require('koa-router')();
var serve = require('koa-static');
var parse = require('co-body');
var request = require('co-request');
var app = koa();

// Include Redis and co wrapper
var Redis = require('redis');
var coRedis = require("co-redis");
var redis = coRedis(Redis.createClient());

app.use(views('views', {
    map: { html: 'handlebars' }
}));

// Key to guest records in Redis database
var GUESTS_SET = 'thursday:guests';
var IMAGES_HASH = 'thursday:images';

router.get('/', function *(next) {
    var names = yield redis.smembers(GUESTS_SET);
    var images = yield redis.hgetall(IMAGES_HASH);

    var guests = names.map(function (name) {
        return {
            name: name,
            image: images[name]
        }
    });

    for (var i = guests.length; i < 12; i++) {
        guests.push({
            name: ''
        });
    }

    yield this.render('index', { guests: guests });
});

app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files from `dist` directory
app.use(serve('dist'));

app.use(function *(){
    this.body = '<h1>404</h1>';
});

app.listen(3000, function () {
    console.log('Listening at port 3000');
});
