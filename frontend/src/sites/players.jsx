import React, { Component } from 'react';
import List from '../components/list';

export default class Players extends Component {
    render() {
        return (
            <div>
                <h1>{'Players'}</h1>
                <List />
            </div>
        );
    }
}
