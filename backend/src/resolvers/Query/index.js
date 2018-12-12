const fs = require('fs');
const path = require('path');
const basename  = path.basename(module.filename);

const index = () => {
    let Query = {};
    fs
    .readdirSync(__dirname)
    .filter(file => file !== basename)
    .map(file => {
        const fileQuery = require(path.join(__dirname, file));
        Query = {...Query, ...fileQuery };
    });
    return Query;
};

module.exports = index();