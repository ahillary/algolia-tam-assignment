require('dotenv').config();
const fs = require('fs');
const algoliasearch = require('algoliasearch');

const content = fs.readFileSync('./data/products.json', 'utf8', (err, data) => {
  if (err) {
    console.error('error while accessing products.json: ', err);
    return;
  }
  return data;
});

const dataset = JSON.parse(content);
const algoliaInput = dataset.map(item => ({
  action: 'addObject',
  indexName: 'SpencerWilliams',
  body: item,
}));

const client = algoliasearch(process.env.APP_ID, process.env.ADMIN_API_KEY);

client.batch(algoliaInput);
