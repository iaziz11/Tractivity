'use strict'

const sql = require('sqlite3');
const util = require('util');


// old-fashioned database creation code 

// creates a new database object, not a 
// new database. 
const db = new sql.Database("activities.db");
const pdb = new sql.Database("profiles.db");

// check if database exists
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='ActivityTable' ";

let pcmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='Profile' ";


db.get(cmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createActivityTable();
  } else {
        console.log("Database file found");
  }
});

pdb.get(pcmd, function (err, val) {
  if (val == undefined) {
        console.log("No database file - creating one");
        createProfile();
  } else {
        console.log("Database file found");
  }
});

// called to create table if needed
function createActivityTable() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE ActivityTable (rowIdNum INTEGER PRIMARY KEY, activity TEXT, date INTEGER, amount FLOAT, id INTEGER)';
  db.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

function createProfile() {
  const pcmd = 'CREATE TABLE Profile (rowIdNum INTEGER PRIMARY KEY, name TEXT, id INTEGER)';
  pdb.run(pcmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

// wrap all database commands in promises
db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

pdb.run = util.promisify(pdb.run);
pdb.get = util.promisify(pdb.get);
pdb.all = util.promisify(pdb.all);

// empty all data from db
db.deleteEverything = async function() {
  await db.run("delete from ActivityTable");
  db.run("vacuum");
}

pdb.deleteEverything = async function() {
  await pdb.run("delete from Profile");
  pdb.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = {db, pdb};
