const fs = require('fs');
const path = require('path');
const notePath = path.resolve(__dirname, '..', 'data', 'results.json');
const axios = require('axios');

const resultsToPrint = 5;

async function fetchData(page) {
    return await axios(`https://rickandmortyapi.com/api/character/?page=${page}`);
}

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

async function search(params) {
    let characters = await getAllData();
    params.forEach((param) => characters = characters.filter(
        (character) => character[param[0]] === param[1]));
    printResults(characters);
    save(characters);
};

function printResults(data) {
    const filteredResultsNumber = data.length;
    const num = (filteredResultsNumber > resultsToPrint) ? resultsToPrint : filteredResultsNumber;

    if (filteredResultsNumber) {
        console.log(`Your search returned ${filteredResultsNumber} results`);
        console.log(`Printing out first ${num} results`);
        data.slice(0, num).map((i) => console.log(i));
    } else {
        console.log("Nothing found");
    }
};

function save(content) {
    fs.writeFileSync(notePath, JSON.stringify(content));
    return console.log(`All data saved to ${notePath}`);
};

module.exports = {
    search,
};
