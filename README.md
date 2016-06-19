
# Poesis

## Overview

A literature blog that displays and organizes poems and short stories. Come and witness works of literature from an NYU English student. Favorite the poems you enjoy most, read about the writer, query for specific works. Check out what the author is reading now and her favorite literature.

Poesis is a website that allows users to get an inside view of an English Majors mind. Look into the workings of a developing young adult through her work. Ask her your questions, submit poems, check out the current featured work. Enjoy a gallery of written art.


## Data Model

We'll need to store the user, poems, short stories, books and a favorite list. The favorite list contains poems and short stories. Each user can only have 1 favorite list, that will be displayed on the favorites page. Poems and short stories will be inserted by me and stored in collections in mongo. Still thinking about where to store submitted works and where to display them. Submitted works will still take the form of poem or short story.

First draft schema:

```javascript
// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
var User = new mongoose.Schema({
  // username, password provided by plugin
  lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

//Poetry that will be displayed
var Poem = new mongoose.Schema({
	title: {type: String, required: true},
	author: {type: String, required: true},
	content: {type: String, required: true,
	date:{type: Date, required: false}
});

// Books to be used to display what the author
//  is reading, her favorites, and what she will read
//  in the future
var Book = new mongoose.Schema({
	title: {type: String, required: true},
	author: {type: String, required: true},
	description: {type, String, required: true}
});

//Short stories that will be displayed
var shortStory = new mongoose.Schema({
	title: {type: String, required: true},
	author: {type: String, required: true},
	content: {type: String, required: true,
	date:{type: Date, required: false}
});

// a favorites list
// * each list must have a related user
// * a list can have 0 or more poems/books
var favoriteList = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
	createdAt: {type: Date, required: false},
	poems: [Poem],
	books: [Book]
});
```

## Wireframes

NO IDEA HOW TO ROTATE THESE IMAGES IN GITHUB!!!
![homepage](documentation/home.jpg)
![about](documentation/about.jpg)
![poems and short stories](documentation/poems.shortstories.jpg)
![submit](documentation/submit.jpg)

## Sitemap

![Sitemap] (documentation/sitemap.png)

## Use Cases

As a reader, I want to search for specific works of literature in order to save time

As a reader, I want to be able to favorite a work and easily view it

As a writer, I want to submit my work so that others can see it

As a user, I want to be able to contact the author

As a user, I want to know what the author is currently reading or what the author will be reading


## Research Topics

Likely research topics include:
<ul>
<li>User Authentication (3 points)</li>
<li>CSS Framework Use (1 point)</li>
<li> ??? (? points)</li>
<li> ??? (? points)</li>
</ul>

### User Authentication

User authentication allows for personalized accounts on web services. Each user has a username and password and their specific items on a particular web service (lists, favorites, etc) can then be tied to their account. Using this in this particular web application is crucial for saving lists that users have created to study from. These lists can be retrieved by the user by simply logging into their account and checking their lists. Will check out Passport.

### CSS Framework

CSS frameworks allow for easier web design that conforms better to current web design standards. It also provides the less graphically inclined with easy to customize templates for a variety of interface components. This would save a great amount of time in comparison to making these interface elements from scratch. Will check out bootstrap

### ??? Need to look into more topics before inserting here

