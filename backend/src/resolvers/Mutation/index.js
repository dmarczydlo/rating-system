const fs = require('fs');
const path = require('path');
const basename  = path.basename(module.filename);

const index = () => {
    let Mutations = {};
    fs
    .readdirSync(__dirname)
    .filter(file => file !== basename)
    .map(file => {
        const fileMutations = require(path.join(__dirname, file));
        Mutations = {...Mutations, ...fileMutations };
    });
    return Mutations;
};

module.exports = index();