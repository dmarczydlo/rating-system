import React from 'react';
import { ListGroupItem } from 'reactstrap';

const DisplayPlayer = ({ player }) => {
    return (
        <ListGroupItem>
            <span>{player.position}) </span>
            <span>{player.name} | </span>
            <span>{player.surname} | </span>
            <span>{player.club} | </span>
            <span>{player.total}</span>
        </ListGroupItem>
    );
};

export default DisplayPlayer;
