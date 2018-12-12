const { forwardTo } = require('prisma-binding');

module.exports = {
    lists: forwardTo('db'),
    list: forwardTo('db')
};