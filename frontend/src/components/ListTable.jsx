import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import "react-table/react-table.css";

const QUERY_ALL_LISTS_QUERY = gql`
  query QUERY_ALL_LISTS_QUERY {
    lists(orderBy: createdAt_ASC) {
        id
        name
        arbiters
    }
  }
 `;

const MUTATION_UPDATE_LIST = gql`
  mutation MUTATION_UPDATE_LIST(
      $id: ID!
      $name: String!
      $arbiters: Int!
  ) {
    updateList(
        id: $id
        name: $name
        arbiters: $arbiters
    )
    {
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
        showDataLayer: false
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
                        onClick={() => this.handleOnClickList('edit', row)}
                        type="button"
                    >
                        {'Edit'}
                    </button>

                    <Link to={`/list/${row.value}`}>
                        {'Enter'}
                    </Link>
                    <button
                        onClick={() => this.handleOnClickList('remove', row)}
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

    handleOnClickList = (type, data) => {
        const { id, name, arbiters } = data.row;
        if (type === 'edit') {

            const dataLayer = {
                arbiters,
                id,
                name
            };
            this.setState({
                dataLayer,
                showDataLayer: true
            });
        }
    }

    handleOnUpdateField = e => {
        let { dataLayer } = this.state;
        let { value } = e.target;
        const { name } = e.target;
        if (value) {
            if (name === "arbiters") {
                value = parseInt(value, 10);
            }
            dataLayer = {
                ...dataLayer,
                [name]: value
            };
            this.setState({ dataLayer });
        }
    }

    updateList = async (e, updateListMutatiomn) => {
        e.preventDefault();
        const { dataLayer } = this.state;
        const res = await updateListMutatiomn({ variables: dataLayer });

        if (res) {
            this.setState({ showDataLayer: false });
        }
    }

    render() {
        const { showDataLayer, dataLayer } = this.state;
        return (
            <div>
                <Query query={QUERY_ALL_LISTS_QUERY}>
                    {({ data, error, loading }) => {

                        if (loading) {
                            return <p>{'Loading...'}</p>;
                        }
                        if (error) {
                            return (<p>{`Error: ${error.message}`}</p>);
                        }
                        return (
                            <div>
                                <ReactTable
                                    columns={this.columns}
                                    data={data.lists}
                                    minRows={0}
                                    showPagination={false}
                                />

                                {showDataLayer && (
                                    <Mutation mutation={MUTATION_UPDATE_LIST} >
                                        {(updateList, { loading, error }) => (
                                            <div>
                                                <input
                                                    name="name"
                                                    onChange={this.handleOnUpdateField}
                                                    value={dataLayer.name}
                                                />
                                                <input
                                                    name="arbiters"
                                                    onChange={this.handleOnUpdateField}
                                                    value={dataLayer.arbiters}
                                                />
                                                <button
                                                    onClick={e => this.updateList(e, updateList)}
                                                    type="button"
                                                >
                                                    {'Update'}
                                                </button>
                                                {error && <div>{JSON.stringify(error)}</div>}
                                                {loading && <p>{'Loading'}</p>}
                                            </div>
                                        )}
                                    </Mutation>
                                )}
                            </div>
                        );
                    }}

                </Query>
            </div>
        );
    }
}

export default ListTable;
