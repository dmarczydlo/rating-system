import React, { Component } from 'react';
import ListTable from '../components/ListTable';

export default class Home extends Component {
    render() {
        return (
            <div>
                <button type="button">
                    {'Add list'}
                </button>

                <ListTable />
            </div>
        );
    }
}
