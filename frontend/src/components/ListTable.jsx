import React, { Component, Fragment } from 'react';
import { Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import "react-table/react-table.css";

const ALL_LISTS_QUERY = gql`
  query ALL_LISTS_QUERY {
    lists(orderBy: createdAt_ASC) {
        id
        name
        arbiters
    }
  }
 `;

const GET_SELECTED_LIST = gql`
query GET_SELECTED_LIST ($id: ID!) {
  list(where: {id: $id}) {
        id
        name
        arbiters
  }
}
`;

// eslint-disable-next-line react/no-multi-comp
class ListTable extends Component {
    state = {
        dataLayer: {},
        showDataLayer: false,
    };

    columns = [
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Arbiters',
            accessor: 'arbiters'
        },
        {
            // eslint-disable-next-line react/display-name
            Cell: row => (
                <Fragment>
                    <button
                        onClick={() => this.handleOnClickList('edit', row.value)}
                        type="button"
                    >
                        {'Edit'}
                    </button>

                    <Link to={`/list/${row.value}`}>
                        {'Enter'}
                    </Link>
                    <button
                        onClick={() => this.handleOnClickList('remove', row.value)}
                        type="button"
                    >
                        {'Remove'}
                    </button>
                </Fragment>
            ),
            Header: 'Operations',
            accessor: 'id'
        }
    ];

    handleOnClickList = async (type, value) => {
        const { client } = this.props;

        const { data } = await client.query({
            query: GET_SELECTED_LIST,
            variables: { id: value }
        });

        if (data.list) {
            this.setState({ showDataLayer: true, dataLayer: data.list });
        }
    }

    handleOnUpdateField = e => {
        console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { showDataLayer, dataLayer } = this.state;
        return (
            <div>
                <Query query={ALL_LISTS_QUERY}>
                    {({ data, error, loading }) => {

                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error: {error.message}</p>;
                        return (
                            <div>
                                <ReactTable
                                    columns={this.columns}
                                    data={data.lists}
                                    minRows={0}
                                    showPagination={false}
                                />

                                {showDataLayer && (
                                    <div>
                                        <input
                                            defaultValue={dataLayer.name}
                                            name="name"
                                            onChange={this.handleOnUpdateField}
                                        />
                                        <input
                                            defaultValue={dataLayer.arbiters}
                                            name="arbiters"
                                            onChange={this.handleOnUpdateField}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }}

                </Query>
            </div>
        );
    }
}

export default withApollo(ListTable);
