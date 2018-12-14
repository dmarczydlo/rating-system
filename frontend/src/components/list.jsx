// eslint-disable-next-line max-lines
import React, { Component, Fragment } from 'react';
import { Query, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import Ranks from './ranks';

import ReactTable from "react-table";
import "react-table/react-table.css";
import {
    Button, Form, FormGroup, Label, Input, Col, Row
} from 'reactstrap';
import Error from './error';

import {
    MdAddCircle, MdEdit, MdSave, MdRemove
} from "react-icons/md";


const MUTATION_DELETE_PLAYER = gql`
  mutation MUTATION_DELETE_PLAYER(
      $id: ID!
  ) {
    deletePlayer(
        id: $id
    )
    {
        id
        name
    }
  }
`;

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
                    <Button
                        color="success"
                        onClick={() => this.handleOnClicPlayer('edit', row)}
                        type="button"
                    >
                        <MdEdit />
                    </Button>

                    <Button
                        color="danger"
                        onClick={() => this.handleOnClicPlayer('remove', row)}
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

    handleOnClicPlayer = async (type, data) => {
        const {
            id, name, surname, club, score1 = 0, score2 = 0, score3 = 0
        } = data.row;
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

        if (type === 'remove') {
            const { client } = this.props;
            await client.mutate({
                mutation: MUTATION_DELETE_PLAYER,
                variables: { id }
            });
        }
    }

    handleOnAddPlayer = () => {
        this.setState({ showPlayerLayer: true });
    }

    handleOnUpdateFields = e => {
        let { playerLayer } = this.state;
        const { value } = e.target;
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
        // eslint-disable-next-line react/prop-types
        const { match: { params: { listId, arbiters } } } = this.props;
        const { showPlayerLayer, playerLayer } = this.state;
        const {
            name = '', surname = '', score1 = 0, score2 = 0, score3 = 0, club = '', id
        } = playerLayer;
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
                            return <Error error={error} />;
                        }
                        return (
                            <div>
                                <Button
                                    color="primary"
                                    onClick={this.handleOnAddPlayer}
                                    type="button"
                                >
                                    <MdAddCircle />
                                </Button>

                                {showPlayerLayer && (
                                    <Mutation
                                        mutation={id ? MUTATION_UPDATE_PLAYER : MUTATION_CREATE_PLAYER}
                                        refetchQueries={[
                                            {
                                                query: QUERY_GET_PLAYERS_FOR_LIST,
                                                variables: { id: listId }
                                            }
                                        ]}
                                    >
                                        {(mutation, { loading, error }) => (

                                            <Form className="form">
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup row>
                                                            <Label
                                                                htmlFor="name"
                                                                size="lg"
                                                                sm={2}
                                                            >
                                                                {'Name'}
                                                            </Label>
                                                            <Col sm={10}>
                                                                <Input
                                                                    name="name"
                                                                    onChange={this.handleOnUpdateFields}
                                                                    value={name}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup row>
                                                            <Label
                                                                htmlFor="surname"
                                                                size="lg"
                                                                sm={2}
                                                            >
                                                                {'Surname'}
                                                            </Label>
                                                            <Col sm={10}>
                                                                <Input
                                                                    name="surname"
                                                                    onChange={this.handleOnUpdateFields}
                                                                    value={surname}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>
                                                        <FormGroup row>
                                                            <Label
                                                                htmlFor="club"
                                                                size="lg"
                                                                sm={2}
                                                            >
                                                                {'Club'}
                                                            </Label>
                                                            <Col sm={10}>
                                                                <Input
                                                                    name="club"
                                                                    onChange={this.handleOnUpdateFields}
                                                                    value={club}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <FormGroup row>
                                                            <Label
                                                                htmlFor="score1"
                                                                size="lg"
                                                                sm={2}
                                                            >
                                                                {'Score1'}
                                                            </Label>
                                                            <Col sm={10}>
                                                                <Input
                                                                    name="score1"
                                                                    onChange={this.handleOnUpdateFields}
                                                                    step="0.01"
                                                                    type="number"
                                                                    value={score1}
                                                                />
                                                            </Col>
                                                        </FormGroup>
                                                    </Col>
                                                    {arbiters >= 2 &&
                                                        <Col md={4}>
                                                            <FormGroup row>
                                                                <Label
                                                                    htmlFor="score2"
                                                                    size="lg"
                                                                    sm={2}
                                                                >
                                                                    {'Score2'}
                                                                </Label>
                                                                <Col sm={10}>
                                                                    <Input
                                                                        name="score2"
                                                                        onChange={this.handleOnUpdateFields}
                                                                        step="0.01"
                                                                        type="number"
                                                                        value={score2}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                    {arbiters >= 3 &&
                                                        <Col md={4}>
                                                            <FormGroup row>
                                                                <Label
                                                                    htmlFor="score3"
                                                                    size="lg"
                                                                    sm={2}
                                                                >
                                                                    {'Score3'}
                                                                </Label>
                                                                <Col sm={10}>
                                                                    <Input
                                                                        name="score3"
                                                                        onChange={this.handleOnUpdateFields}
                                                                        step="0.01"
                                                                        type="number"
                                                                        value={score3}
                                                                    />
                                                                </Col>
                                                            </FormGroup>
                                                        </Col>
                                                    }
                                                </Row>
                                                <Button
                                                    color="primary"
                                                    onClick={e => this.createOrUpdatePlayer(e, mutation)}
                                                    type="button"
                                                >
                                                    <MdSave />
                                                </Button>
                                                {error && <Error error={error} />}
                                                {loading && <p>{'Loading'}</p>}
                                            </Form>
                                        )}
                                    </Mutation>
                                )
                                }
                                <Row>
                                    <Col md={8}>
                                        <ReactTable
                                            columns={this.columns}
                                            data={data.players}
                                            defaultPageSize={100}
                                            minRows={0}
                                            showPagination={false}
                                        />
                                    </Col>

                                    <Col md={4}>
                                        {data.players && <Ranks data={data.players} />}
                                    </Col>
                                </Row>
                            </div>
                        );
                    }}
                </Query>
            </div >
        );
    }
}

export default withRouter(withApollo(List));

export { QUERY_GET_PLAYERS_FOR_LIST };

