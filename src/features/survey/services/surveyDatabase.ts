import SQLite, { type SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'dynamic-survey-hub.db';
let databasePromise: Promise<SQLiteDatabase> | undefined;

export async function getSurveyDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    }).then(async (database) => {
      await database.executeSql('PRAGMA foreign_keys = ON;');

      return database;
    });
  }

  return databasePromise;
}
