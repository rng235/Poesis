var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

//Schemas
var EPoem = mongoose.model('EPoem');
var userPoem = mongoose.model('userPoem');
var User = mongoose.model('User');
var userList = mongoose.model('userList');

//lightweight HTTP request library
var unirest = require('unirest');
//var favoriteList = mongoose.model('favoriteList');

var router = express.Router();

//Used to replace line breaks in user input
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//-------------------------Home Page|Poems-------------------------
router.get('/', function (req, res) {
    res.render('home');
});

router.get('/lionsden', function (req, res) {
    console.log("---------------------------Load Lion's Den Page---------------------------");
    //Find Elizabeth's poems to display

    //If anyone is logged on
    if (!!req.user) {

        //If admin is logged in
        if (req.user.username == "ed1340") {

            EPoem.find(function (err, Poem, count) {
                console.log("---------Find Poem---------");
                //console.log(err, Poem, count);

                if (err) {
                }

                else {
                    res.render('lionsdenadmin', {Poem: Poem});
                }
            });
        }

        //Else display Elizabeth's poetry
        else {
            EPoem.find(function (err, Poem, count) {
                console.log("---------Find Poem---------");
                //console.log(err, Poem, count);

                if (err) {

                }

                else {
                    res.render('lionsden', {Poem: Poem});
                }
            });
        }
    }

    //Else display Elizabeth's poetry
    else {
        EPoem.find(function (err, Poem, count) {
            console.log("---------Find Poem---------");
            //console.log(err, Poem, count);

            if (err) {

            }

            else {
                res.render('lionsden', {Poem: Poem});
            }
        });
    }
});

//--------------------For admin to enter poem--------------------
router.post('/lionsden', function (req, res) {

    var poemInstance;
    var contentRevised = req.body.content.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");

    //Create instance of Poem with user input data
    poemInstance = new EPoem({
        title: req.body.title,
        author: req.body.author,
        date: req.body.date,
        content: contentRevised
    });

    //console.log(poemInstance.content);
    if (poemInstance.title != '' && poemInstance.content != '' && poemInstance.author != '') {

    }

    poemInstance.save(function (err, Poem, count) {
        if (err) {
            console.log(err);
        }

        else {
            console.log("------POEM INSTANCE SAVED------\n", poemInstance);
            res.redirect('/lionsden');
        }
    });
});


//-------------------------User List-------------------------
router.get('/userlist', function (req, res) {
    console.log("---------------------------Load User List Page---------------------------");
    //Find all poems to display
    if (!!req.user) {
        User.findOne({username: req.user.username}).populate('list').exec(function (err, user) {

            var listN = req.user.username + "list";
            console.log("User: " , user);

            if (err) {
                console.log(err);
            }

            else {
                //Retrieve the one list and pass data to html
                console.log("Looking up userList named: ", listN);
                userList.findOne({listName: listN}, function (err, mylist, count) {

                    if (err) {
                        console.log("Error at finding list: ", err);
                        res.redirect('login');
                    }

                    else {
                        console.log("Username: ", req.user.username);
                        console.log("list stuff: ", mylist);
                        res.render('userList', {
                            'listName': mylist.listName,
                            'list': mylist,
                            'username': req.user.username
                        });
                    }
                });
            }
        });
    }

    //if we are not logged in, then prompt the user to login
    else {
        res.redirect('login');
    }

});

router.post('/userlist', function (req, res) {

    var poemInstance;
    var contentRevised = req.body.content.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");

    //Create instance of Poem with user input data
    poemInstance = new userPoem({
        title: req.body.title,
        author: req.body.author,
        date: req.body.date,
        content: contentRevised
    });

    console.log(poemInstance.content);

    var listN = req.user.username + "list";

    if (poemInstance.title != '' && poemInstance.content != '' && poemInstance.author != '') {

    }

    console.log("Adding to list named: ", listN);

    //Find the list and push the new entry into that list
    userList.findOneAndUpdate({listName: listN},
        {$push: {userPoems: poemInstance}},
        function (err, list) {
            if (err) {
                console.log('an error occured');
            }

            else {
                console.log("Saved List: ", list);
                res.redirect('/userlist')
            }
        })
});

//-------------------------Archive-------------------------

//Display authors from api
router.get('/archive', function (req, res) {
    console.log("---------------------------Archive Page---------------------------");

        console.log(req.body);
        unirest.get("https://thundercomb-poetry-db-v1.p.mashape.com/author")
            .header("X-Mashape-Key", "IeSeftOTvPmshTpUAhYwZADkiwe3p1iMUggjsnGIXvN5KU8gCp")
            .end(function (result) {

                res.render("archive", {authorList: result.body});
            });

});

router.get('/archive/:slug', function(req,res) {

    console.log(req.params.slug);
    var url = "https://thundercomb-poetry-db-v1.p.mashape.com/author/"+req.params.slug;

    console.log("URL REQUEST: ", url);
    unirest.get(url)
        .header("X-Mashape-Key", "IeSeftOTvPmshTpUAhYwZADkiwe3p1iMUggjsnGIXvN5KU8gCp")
        .end(function (result) {
            console.log(result.body);
            res.render("archiveSearch", {list: result.body});
        });
});





//-------------------------About Me-------------------------
router.get('/aboutme', function (req, res) {
    console.log("---------------------------Load About Me Page---------------------------")
    res.render('aboutMe');

});





//--------------------------------Authentication--------------------------------
router.get('/login', function (req, res) {
    console.log("---------------------------Load Login Page---------------------------")
    res.render('login');
});

router.post('/login', function (req, res, next) {

    passport.authenticate('local', function (error, user) {
        if (user) {
            req.logIn(user, function (error) {
                res.redirect('/lionsden');  //if successful, redirect to homepage
            });
        }
        else {
            res.render('login', {message: 'Sorry, your username or password is incorrect.'});
        }
    })(req, res, next);
});

router.get('/register', function (req, res) {
    console.log("---------------------------Load Registration Page---------------------------")
    res.render('register');
});

router.post('/register', function (req, res) {
    //register a new user with given username and password from form
    User.register(new User({username: req.body.username}), req.body.password, function (error, user) {

        console.log("Registering");
        if (error) {
            console.log(error);
            res.render('register', {message: 'Sorry, your registration information is not valid.'});
        }
        else {
            passport.authenticate('local')(req, res, function () {

                //When registering successfully, create a unique list for this user
                var newList = new userList({
                    user: req.user._id,
                    //THE USER LIST NAME
                    listName: req.user.username + "list",
                    userPoems: []
                });

                newList.save(function (err, list) {
                    req.user.list.push(list);

                    req.user.save(function (err, user) {

                        if (err) {
                            console.log(err);
                        }

                        //Redirect to poems after registering and adding list
                        else {
                            console.log("List " + req.user.username + "list Added & Successfully Registered");
                            res.redirect('/lionsden');
                        }
                    });
                });
            });
        }
    });

    //******************************************************************************
});
console.log("-----------------------------LISTENING ON PORT 3000-----------------------------");

module.exports = router;
