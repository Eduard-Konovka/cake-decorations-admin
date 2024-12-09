const fs = require('fs');
const db = require('./server');

async function updateDB(collection, outputFileName) {
  const outputFile = `../${outputFileName}.json`;
  const data = [];
  const snapshot = await db.collection(collection).get();

  snapshot.forEach(doc => {
    data.push({ _id: doc.id, ...doc.data() });
  });

  fs.writeFile(outputFile, JSON.stringify(data, null, 2), 'utf-8', err => {
    if (err) {
      console.error('Ошибка записи файла:', err);
    } else {
      console.log(`Данные успешно сохранены в файл ${outputFile}`);
    }
  });
}

updateDB('categories', 'categories');
updateDB('products', 'products');
// getDB('dictionaries', 'dictionaries');
