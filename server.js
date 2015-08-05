var views = require('koa-views');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var parse = require('co-body');
var serve = require('koa-static');
var Handlebars = require('handlebars');

Handlebars.registerHelper('nword', function(n, a, b, c) {
    var rem100 = n % 100;
    var rem10 = n % 10;
    if (rem100 >= 11 && rem100 <= 19) {
        return c;
    }
    if (rem10 === 1) {
        return a;
    } else if (rem10 >= 2 && rem10 <= 4) {
        return b;
    } else {
        return c;
    }
});

var MongoClient = require('mongodb').MongoClient;

var mongo = MongoClient.connect('mongodb://localhost:27017/meetup');

var INVITES = 12;

router
    .get('/', function *(next) {
        var guests = yield mongo.then(function (db) {
            var guests = db.collection('guests');
            var count = guests.count();
            return count;
        });
        yield this.render('index', { invites: INVITES - guests });
    })
    .post('/', function *(next) {
        var body = yield parse(this);
        console.log('> Guest send request!');
        console.log(JSON.stringify(body, 0, 4));

        var db = yield mongo;
        var guestsDb = db.collection('guests');
        var enrolledGuest = guestsDb.find({
            name: body.name,
            contact: body.contact
        });
        var isEnrolled = yield enrolledGuest.count();
        
        if (!isEnrolled && body.name && body.contact) {
            guestsDb.insert({
                name: body.name,
                contact: body.contact
            });   
        }
        
        yield this.render('index', { post: 'done', name: body.name });
    });

app.use(views('views', {
    map: { html: 'handlebars' }
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
