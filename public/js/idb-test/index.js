import idb from 'idb';

var dbPromise = idb.open('test-db', 2, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
      // break; —we specifically DON'T want a break in these cases
      // eslint-disable-next-line no-fallthrough
    case 1:
      upgradeDb.createObjectStore('people', {keyPath: 'name'});
  }
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  // TODO: in the keyval store, set
  // "favoriteAnimal" to your favourite animal
  // eg "cat" or "dog"
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('kangaroo', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:kangaroo to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Hector Elizondo',
    age: 57,
    favoriteAnimal: 'tarsier'
  });

  peopleStore.put({
    name: 'Alison Janney',
    age: 54,
    favoriteAnimal: 'giraffe'
  });

  peopleStore.put({
    name: 'Fred Lewis',
    age: 35,
    favoriteAnimal: 'hippopotamus'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');

  return peopleStore.getAll();
}).then(function(people) {
  console.log('People:', people);
});
