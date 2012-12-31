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
var user = UserModel.create({
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

## Querying ##
Modelize offers a simple API for finding and sorting existing items/instances. Please remember, that an instance can only be found, if ```instance.save()``` was called.

The API is (as you might expect for a NodeJS library) asynchronous and the methods for querying are static methods on each model constructor.

### Shared instances ###
Instances are always shared to save memory usage and keep the usage simple. This means:

```javascript
var user1 = UserModel.create({
	lastName: 'Doe'
});
var user2 = UserModel.create({
	lastName: 'Doe'
});

UserModel.find({lastName: 'Doe'}, function(err, data) {
	// data[0] is the same instance as user1
	// data[1] is the same instance as user2

	user1.lastName('Smith');
	console.log(user1.lastName() == data[0].lastName()) // Is true
});
```

### Finding a single item ###
Use the ```findOne``` method to find a single item. You can specify a set of query parameters in the form of an object-literal. In the case of multiple results, it will only return the first one. If no result can be found, the return value is ```undefined```.

```javascript
UserModel.findOne({username: 'jdoe'}, function(err, user) {
	if(err) throw err;
	if(user === undefined) throw new Error('User not found!');
	console.log(user);
});
```

### Collection of items ###
Use the ```find``` method to find lots of items. Pass it a set of query parameters in the form of an object-literal, where each key is a field to compare and the value is a simple value for comparison. (equal to)

```javascript
UserModel.find({lastName: 'Smith'}, function(err, data) {
	if(err) throw err;
	// Data is now array filled with all results found
});
```

- - -
Modelize Javascript ORM - © 2012-2013 P. Mathis (pmathis@snapserv.net)