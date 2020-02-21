const yargs = require('yargs');
const {search} = require('./services/characterService');

const arrayOfValidParams = ["name", "id", "status", "species", "gender"];

yargs.command({
    command: 'search',
    describe: 'searching',
    builder: {
        name: {
            type: 'string',
            demandOption: false,
            description: 'name',
        },
        id: {
            type: 'number',
            demandOption: false,
            description: 'id',
        },
        status: {
            type: 'string',
            demandOption: false,
            description: 'status',
        },
        species: {
            type: 'string',
            demandOption: false,
            description: 'species',
        },
        gender: {
            type: 'string',
            demandOption: false,
            description: 'gender',
        },
    },
    handler(args) {
        search(getParams(args));
    },
})
    .demandCommand(1, 'You cannot run without any command')
    .argv;

function getParams(args) {
    return Object.entries(args).filter((param) => arrayOfValidParams.includes(param[0]));
};
