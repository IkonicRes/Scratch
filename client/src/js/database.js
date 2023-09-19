import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  try {
    console.log('Getting Database...')
    const contentDb = await openDB('jate', 1)
    const text = contentDb.transaction('jate', 'readonly')
    const store = text.objectStore('jate')
    const request = store.getAll()
    const result = await request
    console.log('result.value', result)
    return result
  } catch (error) {
  console.error('putDb not executed correctly: ', error);
} 
}

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {
    console.log('GETTING from database')
    const contentDb = await openDB('jate', 1)
    const text = contentDb.transaction('jate', 'readonly')
    const store = text.objectStore('jate')
    const request = store.getAll()
    const result = await request
    console.log('result: ', result)
    return result?.value
  } catch (error) {
    console.error('getDb not executed correctly: ', error)
  }
}

initdb();
