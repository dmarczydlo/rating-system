const { forwardTo } = require('prisma-binding');

module.exports = {
    player: forwardTo('db'),
    players: forwardTo('db')
};