import React, { Component, Fragment } from 'react';
import { Query, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import {
    Button, Form, FormGroup, Label, Input
} from 'reactstrap';
import Error from './error';

import {
    MdAddCircle, MdEdit, MdSave, MdRemove, MdLabel
} from "react-icons/md";


const MUTATION_DELETE_LIST = gql`
  mutation MUTATION_DELETE_LIST(
      $id: ID!
  ) {
    deleteList(
        id: $id
    )
    {
        id
        name
        arbiters
    }
  }
`;


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

const MUTATION_CREATE_LIST = gql`
  mutation MUTATION_CREATE_LIST (
      $name: String!
      $arbiters: Int!
  ) {
      createList (
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
                    <Button
                        color="success"
                        onClick={() => this.handleOnClickList('edit', row)}
                        type="button"
                    >
                        <MdEdit />
                    </Button>

                    <Link
                        // eslint-disable-next-line react/forbid-component-props
                        className="btn btn-primary"
                        to={`/players/${row.value}/${row.row.arbiters}`}
                    >
                        <MdLabel />
                    </Link>
                    <Button
                        color="danger"
                        onClick={() => this.handleOnClickList('remove', row)}
                        type="button"
                    >
                        <MdRemove />
                    </Button>
                </Fragment>
            ),
            Header: 'Operations',
            accessor: 'id'
        }
    ];

    handleOnClickList = async (type, data) => {
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

        if (type === 'remove') {
            const { client } = this.props;
            await client.mutate({
                mutation: MUTATION_DELETE_LIST,
                variables: { id }
            });
        }
    }

    handleOnUpdateField = e => {
        let { dataLayer } = this.state;
        let { value } = e.target;
        const { name } = e.target;
        if (name === "arbiters") {
            value = parseInt(value, 10);
        }
        dataLayer = {
            ...dataLayer,
            [name]: value
        };
        this.setState({ dataLayer });
    }

    handleOnClickNewList = () => {
        const dataLayer = {
            arbiters: '',
            name: ''
        };
        this.setState({
            dataLayer,
            showDataLayer: true
        });
    }

    createOrUpdateList = async (e, updateListMutatiomn) => {
        e.preventDefault();
        const { dataLayer } = this.state;
        const res = await updateListMutatiomn({ variables: dataLayer });

        if (res) {
            this.setState({ showDataLayer: false });
        }
    }

    render() {
        const { showDataLayer, dataLayer } = this.state;
        const { id = '' } = dataLayer;
        return (
            <div>
                <Query query={QUERY_ALL_LISTS_QUERY}>
                    {({ data, error, loading }) => {

                        if (loading) {
                            return <p>{'Loading...'}</p>;
                        }
                        if (error) {
                            return <Error error={error} />;
                        }
                        return (
                            <div>
                                <Button
                                    color="info"
                                    onClick={this.handleOnClickNewList}
                                    type="button"
                                >
                                    <MdAddCircle />
                                </Button>
                                {showDataLayer && (
                                    <Mutation
                                        mutation={id ? MUTATION_UPDATE_LIST : MUTATION_CREATE_LIST}
                                        update={(cache, { data: { createList } }) => {
                                            if (!id) {
                                                const { lists } = cache.readQuery({ query: QUERY_ALL_LISTS_QUERY });
                                                cache.writeQuery({
                                                    data: { lists: lists.concat([createList]) },
                                                    query: QUERY_ALL_LISTS_QUERY
                                                });
                                            }
                                        }}
                                    >
                                        {(mutation, { loading, error }) => (
                                            <div>
                                                <Form
                                                    className="form"
                                                    inline
                                                >

                                                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                                        <Label
                                                            className="mr-sm-2"
                                                            htmlFor="name"
                                                        >
                                                            {'Name'}
                                                        </Label>
                                                        <Input
                                                            name="name"
                                                            onChange={this.handleOnUpdateField}
                                                            value={dataLayer.name}
                                                        />
                                                    </FormGroup>

                                                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                                        <Label
                                                            className="mr-sm-2"
                                                            htmlFor="arbiters"
                                                        >{'Arbiters'}
                                                        </Label>
                                                        <Input
                                                            max={3}
                                                            name="arbiters"
                                                            onChange={this.handleOnUpdateField}
                                                            type="number"
                                                            value={dataLayer.arbiters}
                                                        />
                                                    </FormGroup>

                                                    <Button
                                                        color="primary"
                                                        onClick={e => this.createOrUpdateList(e, mutation)}
                                                        type="button"
                                                    >
                                                        <MdSave />
                                                    </Button>
                                                </Form>
                                                {error && <Error error={error} />}
                                                {loading && <p>{'Loading'}</p>}
                                            </div>
                                        )}
                                    </Mutation>
                                )
                                }
                                <ReactTable
                                    columns={this.columns}
                                    data={data.lists}
                                    defaultPageSize={100}
                                    minRows={0}
                                    showPagination={false}
                                />
                            </div>
                        );
                    }}

                </Query>
            </div>
        );
    }
}

export default withApollo(ListTable);
