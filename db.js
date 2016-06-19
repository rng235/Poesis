var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var URLSlugs = require('mongoose-url-slugs');


//Poetry that will be displayed
var EPoem = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    content: {type: String, required: true},
    date:{type: Date, required: false}
});

//Poetry that will be displayed
var userPoem = new mongoose.Schema({
    //user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: {type: String, required: true},
    author: {type: String, required: true},
    content: {type: String, required: true},
    date:{type: Date, required: false}
});

var userList = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    listName: {type: String, required: true},
    userPoems: [userPoem]
});
// a favorites list
// * each list must have a related user
// * a list can have 0 or more poems/books
//var favoriteList = new mongoose.Schema({
//    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
//    listName: {type: String, required: true},
//    EPoems: [EPoem],
//    userPoems: [userPoem]
//});

//I WANT ONLY 1 LIST
var User = new mongoose.Schema({
    // username, password provided by plugin
    //list:  [{type: mongoose.Schema.Types.ObjectId, ref: 'favoriteList'}]
    //list: [favoriteList],
    list: [userList]
});

//For authentication
User.plugin(passportLocalMongoose);

//userList.plugin(URLSlugs('listName'));

//mongoose.model('PoemList, PoemList');
mongoose.model('User', User);
mongoose.model('userList', userList);
mongoose.model('EPoem', EPoem);
mongoose.model('userPoem', userPoem);
//mongoose.model('favoriteList', favoriteList);

//For Local Testing
mongoose.connect('mongodb://localhost/final');

//For i6 Deployment
//mongoose.connect('mongodb://rng235:J28jZT92@class-mongodb.cims.nyu.edu/rng235');
