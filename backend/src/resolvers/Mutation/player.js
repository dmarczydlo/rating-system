const _ = require('lodash');

module.exports = {

    async createPlayer(parent, args, ctx, info) {
     
        const { name, surname, club, score1, scrore2, score3, listId } = args;
      
        if (!name || !surname || !club || !listId) {
            throw new Error('PLAYER_BAD_REQUEST');
        }

        const player = await ctx.db.mutation.createPlayer({
            data: {
                list: {
                    connect: {
                        id: listId
                    }
                },
                ..._.omit(args, "listId")
            }

        }, info);

        return player;
    },

    async updatePlayer(parent, args, ctx, info) {
        const { arbiters } = args;
       
        const update = { ...args };
        delete update.id;

        return ctx.db.mutation.updatePlayer({
            data: update,
            where: {
                id: args.id
            }
        }, info);
    },

    async deletePlayer(parent, args, ctx, info) {
        const where = { id: args.id };
        const player = await ctx.db.query.player({ where });
        if (!player) {
            throw new Error('PLAYER_BAD_REQUEST');
        }
        return ctx.db.mutation.deletePlayer({ where }, info);
    }
};