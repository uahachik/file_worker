<p>
  <img src="./images/2020-01-11 13_09_11-Understanding Streams in Node.js - NodeSource.png" width="600" alt="Understanding Streams in Node.">
  <h2>A practical code without anything extra.</h2>
  <h4>Test assignment</h4>
It is necessary to develop a primitive API on NodeJS + Express + Mongo / Postgre / MySQL (base to choose from).

There should be several endpoints:

1. Upload a CSV file on server. The file must be parsed and stored in the database

2. Get a collection of users in json format

3. Download the CSV file from server. It is necessary to serialize a collection of users from the database to a CSV file and send it.

Requirements:

- modular project structure;

- ES6+;

- work with files only in streams (do not save csv in the file system);

- ODM/ORM for work with databases;

- error handling;

- clean code;

- the code and the project structure should be consistency.

CSV file structure:

The first line is UserName, FirstName, LastName, Age

The remaining lines (example) - TheBlade, Boris, Yurinov, 47

... and so on

</p>
