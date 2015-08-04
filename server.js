var views = require('koa-views');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var parse = require('co-body');
var serve = require('koa-static');

var MongoClient = require('mongodb').MongoClient;

var mongo = MongoClient.connect('mongodb://localhost:27017/meetup');

router
    .get('/', function *(next) {
        yield this.render('index');
    })
    .post('/', function *(next) {
        var body = yield parse(this);
        console.log('> Guest send request!');
        console.log(JSON.stringify(body, 0, 4));
        mongo.then(function (db) {
            var guests = db.collection('guests');
            guests.insert({
                name: body.name,
                contact: body.contact
            });
        }).catch(function (error) {
            console.log(error)
        });

        yield this.render('index', { post: 'done', name: body.name });
    });

app.use(views('views', {
    map: {
        html: 'handlebars'
    }
}));

app.use(router.routes());
app.use(router.allowedMethods());

app.use(serve('views'));

app.use(function *(){
    this.body = '<h1>404</h1>';
});

app.listen(4000, function () {
    console.log('listen');
});
