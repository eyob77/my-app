import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('stationery.db');

export const initDatabase = () => {
  // Use "products" (plural) to match your screen queries
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      quantity INTEGER DEFAULT 0,
      minThreshold INTEGER DEFAULT 5
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      type TEXT, 
      amount INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(productId) REFERENCES products(id)
    );
  `);
};

export default db;