const fs = require('fs');
const path = require('path');
const notePath = path.resolve(__dirname, '..', 'data', 'results.json');
const axios = require('axios');

const resultsToPrint = 5;

/**
 *
 * @param page page number to fetch
 * @returns {AxiosPromise<any>}
 */
async function fetchData(page) {
  return axios(`https://rickandmortyapi.com/api/character/?page=${page}`);
}

/**
 * get data from all pages
 * @returns {Promise<any[]>}
 */
async function getAllData() {
  let page = 0;
  let content;
  let allData = [];
  do {
    page++;
    content = await fetchData(page);
    allData.push(content.data.results);
  } while (content.data.info.next);
  return await Promise.all(allData).then((data) => data.flat());
}

/**
 *
 * @param params parameters provided in command line
 * @returns {Promise<void>}
 */
async function search(params) {
  let characters = await getAllData();
  params.forEach((param) => characters = characters.filter(
    (character) => character[param[0]] === param[1]));
  printResults(characters);
  save(characters);
}

/**
 * print out the search results to console
 * @param data
 */
function printResults(data) {
  const filteredResultsNumber = data.length;
  const num = (filteredResultsNumber > resultsToPrint) ? resultsToPrint : filteredResultsNumber;

  if (filteredResultsNumber) {
    console.log(`Your search returned ${filteredResultsNumber} results`);
    console.log(`Printing out first ${num} results`);
    data.slice(0, num).map((i) => console.log(i));
  } else {
    console.log('Nothing found');
  }
}

/**
 * write data to file
 * @param data data to be save to file
 */
function save(data) {
  fs.writeFileSync(notePath, JSON.stringify(data));
  return console.log(`All data saved to ${notePath}`);
}

module.exports = {
  search,
};
