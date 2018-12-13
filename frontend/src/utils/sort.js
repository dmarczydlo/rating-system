import _ from 'lodash';

const insertScore = data => {
    data.map(item => {
        item.total = (item.score1 + item.score2 + item.score3) / item.list.arbiters;
    });
    return data;
};

const sort = data => _.orderBy(data, "total", ["desc"]);


const insertPosition = (data) => {
    let position = 0;
    const totals = [];
    data.map(elem => {
        if (!totals.includes(elem.total)) {
            position += 1;
        }
        totals.push(elem.total);
        elem.position = position;

    });
    return data;
};

const result = data => insertPosition(sort(insertScore(data)));

export { result };
