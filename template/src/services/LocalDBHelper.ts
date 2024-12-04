import SQLite from 'react-native-sqlite-storage';

// Enable debugging for development
// SQLite.DEBUG(true);
SQLite.enablePromise(true);

// Open or create the database
const database = SQLite.openDatabase(
  {
    name: 'my_database.db',
    location: 'default', // Can be 'default' or 'Library' (iOS) or 'Documents' (Android)
  },
  () => {
    console.log('Database opened');
  },
  error => {
    console.error('Error opening database', error);
  },
);

export default database;
