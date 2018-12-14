import React from 'react';
import { ListGroupItem, Badge } from 'reactstrap';

const DisplayPlayer = ({ player }) => {
    return (
        <ListGroupItem>
<Badge pill>{player.position}</Badge> {`${player.name} ${player.surname} (${player.club})`} {'-'} {player.total}
        </ListGroupItem>
    );
};

export default DisplayPlayer;
