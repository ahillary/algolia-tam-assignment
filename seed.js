require('dotenv').config();
const fs = require('fs');
const algoliasearch = require('algoliasearch');

// read the data from the file 'products.json' and store it in the variable 'content', as a string
const content = fs.readFileSync('./data/products.json', 'utf8', (err, data) => {
  if (err) {
    console.error('error while accessing products.json: ', err);
    return;
  }
  return data;
});

// update the data stored in variable 'content', to a an array of objects
const dataset = JSON.parse(content);

// each object in the array will be assigned to the body key within a new object, preparing this information to be sent to Algolia to create a new Index titled 'SpencerWilliams'
const algoliaInput = dataset.map(item => ({
  action: 'addObject',
  indexName: 'SpencerWilliams',
  body: item,
}));

// establish access to a specific Algolia account
const client = algoliasearch(process.env.APP_ID, process.env.ADMIN_API_KEY);

// send the data to Algolia to creat an Index
client.batch(algoliaInput);
