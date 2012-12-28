# Modelize #

[![build status](https://secure.travis-ci.org/NeoXiD/modelize.png)](http://travis-ci.org/NeoXiD/modelize)

Modelize is a simple ORM written in JavaScript.

## License ##
Apache License (version 2)

## Prerequisites ##
Modelize requires version 0.6.x of Node.js or higher. If you want to run the tests or work on model, you'll want [Vows](https://github.com/cloudhead/vows).

## Installing with [NPM](http://npmjs.org) ##

```
npm install modelize
```

## Adapters ##
Modelize currently implements an in-memory store. More adapters will follow, a socket.io binding is also planned.

## Defining models
Modelize uses a simple syntax for defining a model. It will look like this:

```javascript
var UserModel = new Modelize('User', function() {
	this.adapter('memory');
	this.property('username', 'string', { required: true });
	this.property('password', 'string', { required: true });
	this.property('firstName', 'string', { defaultValue: 'John' });
	this.property('lastName', 'string', { defaultValue: 'Doe' });
});
```

## Creating instances ##
Now you can create instances of your new fancy User model. It is easy too:

```javascript
var user = new UserModel({
	username: 'jdoe',
	password: 'fancymodels',
	lastName: 'Smith'
});
```

## Getting and setting properties
Just use the following syntax:

```javascript
// Getting properties
console.log(user.username());
console.log(user.password());

// Setting properties
user.password('modelize');
```

If you try to get a property which was not initialized yet, it will return the default value or undefined if there is none.

## Saving & Deleting of model instances ##
**Remember:** You must initialize/set all required properties before saving the model. Otherwise Modelize will throw an error. 

```javascript
user.save(); // Saves the model instance into the store
user.password('nodejs');
user.save(); // Updates the model instance in the store
user.remove(); // Removes the model instance from the store
```

- - -
Modelize Javascript ORM - © 2012 P. Mathis (pmathis@snapserv.net)