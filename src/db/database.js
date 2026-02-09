import Dexie from 'dexie';

const db = new Dexie('UnitMasterDB');

db.version(1).stores({
    favorites: '++id, fromUnitId, toUnitId, timestamp', // Indexing for favorites
    history: '++id, value, fromUnitId, toUnitId, result, timestamp', // Indexing for history
    settings: 'key, value' // Key-value store for settings
});

export default db;
