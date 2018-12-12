
module.exports = {

    async createList(parent, args, ctx, info) {
        const { name, arbiters } = args;
        if (!name || !arbiters) {
            throw new Error('LIST_BAD_REQUEST');
        }

        const list = await ctx.db.mutation.createList({
            data: {
                name, arbiters
            }
        }, info);

        return list;
    },

    updateList(parent, args, ctx, info) {
        const { arbiters } = args;
        if ((arbiters > 3 || arbiters < 1) && arbiters) {
            throw new Error('ARBITERS_INCORRECT_VALUE');
        }

        const update = { ...args };
        delete update.id;

        return ctx.db.mutation.updateList({
            data: update,
            where: {
                id: args.id
            }
        }, info);
    },

    async deleteList(parent, args, ctx, info) {
        const where = { id: args.id };
        const list = await ctx.db.query.list({ where });
        if (!list) {
            throw new Error('LIST_BAD_REQUEST');
        }
        return ctx.db.mutation.deleteList({ where }, info);
    }
};