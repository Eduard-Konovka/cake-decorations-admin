const fs = require('fs');
const db = require('./node/server');

async function updateDB(collection, outputFileName) {
  const outputFile = `./src/db/${outputFileName}.json`;
  const snapshot = await db.collection(collection).get();

  const data = [];
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

async function updateDictionaries(collectionArr, outputFileName) {
  const outputFile = `./src/db/${outputFileName}.json`;

  const data = {};

  for (let i = 0; i < collectionArr.length; i++) {
    const snapshot = await db.collection(collectionArr[i].collection).get();

    const collectionData = [];
    if (collectionArr[i].nestingLevel === 1) {
      snapshot.forEach(doc => {
        collectionData.push(...doc.data()[collectionArr[i].collection]);
      });
    } else if (collectionArr[i].nestingLevel === 2) {
      snapshot.forEach(doc => {
        collectionData.push(doc.data());
      });
    }

    data[collectionArr[i].collection] = collectionData;
  }

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
updateDictionaries(
  [
    { collection: 'tags', nestingLevel: 2 },
    { collection: 'links', nestingLevel: 1 },
  ],
  'dictionaries',
);
