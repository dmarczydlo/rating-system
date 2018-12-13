import React, { Fragment } from 'react';
import { result } from '../utils/sort';
import DisplayPlayer from './displayPlayer';
import { ListGroup } from 'reactstrap';


const Ranks = ({ data }) => {
    return (
        <Fragment>
            <h2>{'Rank'}</h2>
            <ListGroup>
                {data && result(data).map(player => (
                    <DisplayPlayer
                        key={player.id}
                        player={player}
                    />
                ))}
            </ListGroup>
        </Fragment>
    );
};

export default Ranks;