import database from '../services/LocalDBHelper';
import {MakeCall} from './GraphApiBase';
import SQLite from 'react-native-sqlite-storage';

// const database = SQLite.openDatabase(
//     {
//       name: 'my_database.db',
//       location: 'default', // Can be 'default' or 'Library' (iOS) or 'Documents' (Android)
//     },
//     () => {
//       console.log('Database opened');
//     },
//     error => {
//       console.error('Error opening database', error);
//     },
//   );

export async function getUserAsync(query: string) {
  const res = await MakeCall('', query);
  return res;
}

export async function createUsersTable() {
  try {
    const db = await database;
    console.log('database details', db);
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  age INTEGER)`,
        [],
        (tx: SQLite.Transaction, result: SQLite.ResultSet) => {
          console.log(
            'Table created successfully',
            result.rowsAffected,
            result.rows,
          );
        },
        (tx: SQLite.Transaction, error: SQLite.SQLError) => {
          console.error('Error creating table:', error);
        },
      );
    });
  } catch (error) {
    console.error('Error In catch:', error);
  }
}

// create DB conn on init
// Local DB service
// create tables
// merge into local
// Sync on init
// push and then pull and merge with local
//
