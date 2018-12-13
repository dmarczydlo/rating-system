import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import Ranks from './ranks';
import DisplayPlayer from './displayPlayer';

import ReactTable from "react-table";
import { Link } from 'react-router-dom';
import "react-table/react-table.css";

const QUERY_GET_PLAYERS_FOR_LIST = gql`
  query QUERY_GET_PLAYERS_FOR_LIST ($id: ID! ) {
    players(where:{list: {id: $id}}) {
            id
            name
            surname
            club
            score1
            score2
            score3
            list {
             arbiters
            }
        }
  }
`;

const MUTATION_UPDATE_PLAYER = gql`
  mutation MUTATION_UPDATE_PLAYER(
      $id: ID!
      $name: String!
      $surname: String!
      $club: String!
      $score1: Float
      $score2: Float
      $score3: Float
  ) {
    updatePlayer(
        id: $id
        name: $name
        surname: $surname
        club: $club
        score1: $score1
        score2: $score2
        score3: $score3
    )
    {
        id
        name
        surname
        club
        score1
        score2
        score3
    }
  }
`;

const MUTATION_CREATE_PLAYER = gql`
  mutation MUTATION_CREATE_PLAYER (
    $name: String!
    $surname: String!
    $club: String!
    $score1: Float
    $score2: Float
    $score3: Float
    $listId: ID!
  ) {
      createPlayer (
        name: $name
        surname: $surname
        club: $club
        score1: $score1
        score2: $score2
        score3: $score3
        listId: $listId
      )
      {
        id
        name
        surname
        club
        score1
        score2
        score3
      }
  }
`;

class List extends Component {

    state = {
        playerLayer: {
            club: '',
            name: '',
            score1: 0,
            score2: 0,
            score3: 0,
            surname: ''
        },
        showPlayerLayer: false
    };

    columns = [
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Surname',
            accessor: 'surname'
        },
        {
            Header: 'Club',
            accessor: 'club'
        },
        {
            Header: 'Score1',
            accessor: 'score1'
        },
        {
            Header: 'Score2',
            accessor: 'score2'
        },
        {
            Header: 'Score3',
            accessor: 'score3'
        },
        {
            // eslint-disable-next-line react/display-name
            Cell: row => (
                <Fragment>
                    <button
                        onClick={() => this.handleOnClicPlayer('edit', row)}
                        type="button"
                    >
                        {'Edit'}
                    </button>

                    <button
                        onClick={() => this.handleOnClicPlayer('remove', row)}
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

    handleOnClicPlayer = (type, data) => {
        const { id, name, surname, club, score1 = 0, score2 = 0, score3 = 0 } = data.row;
        if (type === 'edit') {

            const playerLayer = {
                club,
                id,
                name,
                score1,
                score2,
                score3,
                surname
            };

            this.setState({
                playerLayer,
                showPlayerLayer: true
            });
        }
    }

    handleOnAddPlayer = () => {
        this.setState({ showPlayerLayer: true });
    }

    handleOnUpdateFields = e => {
        let { playerLayer } = this.state;
        let { value } = e.target;
        const { name } = e.target;

        playerLayer = {
            ...playerLayer,
            [name]: value
        };
        this.setState({ playerLayer });
    }

    createOrUpdatePlayer = async (e, updatePlayer) => {
        e.preventDefault();
        const { match: { params: { listId } } } = this.props;
        let { playerLayer } = this.state;
        playerLayer = {
            ...playerLayer,
            ...{ listId }
        };

        const res = await updatePlayer({ variables: playerLayer });

        if (res) {
            this.setState({
                playerLayer: {
                    club: '',
                    name: '',
                    score1: 0,
                    score2: 0,
                    score3: 0,
                    surname: ''
                },
                showPlayerLayer: false
            });
        }
    }


    render() {
        const { match: { params: { listId, arbiters } } } = this.props;
        const { showPlayerLayer, playerLayer } = this.state;
        const { name = '', surname = '', score1 = 0, score2 = 0, score3 = 0, club = '', id } = playerLayer;
        return (
            <div>
                <Query
                    query={QUERY_GET_PLAYERS_FOR_LIST}
                    variables={{ id: listId }}
                >
                    {({ error, loading, data }) => {

                        if (loading) {
                            return <p>{'Loading...'}</p>;
                        }
                        if (error) {
                            return (<p>{`Error: ${error.message}`}</p>);
                        }
                        return (
                            <div>
                                <button
                                    onClick={this.handleOnAddPlayer}
                                    type="button"
                                >
                                    {'Add Player'}
                                </button>

                                {showPlayerLayer && (
                                    <Mutation
                                        mutation={id ? MUTATION_UPDATE_PLAYER : MUTATION_CREATE_PLAYER}
                                        refetchQueries={[{
                                            query: QUERY_GET_PLAYERS_FOR_LIST,
                                            variables: { id: listId }
                                        }]}
                                    >
                                        {(mutation, { loading, error }) => (
                                            <div>
                                                <label htmlFor="name">{'Name'}</label>
                                                <input
                                                    name="name"
                                                    onChange={this.handleOnUpdateFields}
                                                    value={name}
                                                />

                                                <label htmlFor="surname">{'Surname'}</label>
                                                <input
                                                    name="surname"
                                                    onChange={this.handleOnUpdateFields}
                                                    value={surname}
                                                />

                                                <label htmlFor="club">{'Club'}</label>
                                                <input
                                                    name="club"
                                                    onChange={this.handleOnUpdateFields}
                                                    value={club}
                                                />

                                                <label htmlFor="score1">{'Score1'}</label>
                                                <input
                                                    name="score1"
                                                    onChange={this.handleOnUpdateFields}
                                                    step="0.01"
                                                    type="number"
                                                    value={score1}
                                                />
                                                {arbiters >= 2 &&
                                                    <Fragment>

                                                        <label htmlFor="score2">{'Score2'}</label>
                                                        <input
                                                            name="score2"
                                                            onChange={this.handleOnUpdateFields}
                                                            step="0.01"
                                                            type="number"
                                                            value={score2}
                                                        />
                                                    </Fragment>
                                                }
                                                {arbiters >= 3 &&
                                                    <Fragment>
                                                        <label htmlFor="score3">{'Score3'}</label>
                                                        <input
                                                            name="score3"
                                                            onChange={this.handleOnUpdateFields}
                                                            step="0.01"
                                                            type="number"
                                                            value={score3}
                                                        />
                                                    </Fragment>
                                                }

                                                <button
                                                    onClick={e => this.createOrUpdatePlayer(e, mutation)}
                                                    type="button"
                                                >
                                                    {'Save'}
                                                </button>
                                                {error && <div>{JSON.stringify(error)}</div>}
                                                {loading && <p>{'Loading'}</p>}
                                            </div>
                                        )}
                                    </Mutation>
                                )
                                }
                                <ReactTable
                                    columns={this.columns}
                                    data={data.players}
                                    minRows={0}
                                    showPagination={false}
                                    defaultPageSize={100}
                                />


                                {data.players && <Ranks data={data.players} />}
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default withRouter(List);

export {
    QUERY_GET_PLAYERS_FOR_LIST
}

