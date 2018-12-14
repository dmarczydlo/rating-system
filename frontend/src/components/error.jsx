import React, { Component } from 'react';
import { Alert, Row } from 'reactstrap';
import PropTypes from 'prop-types';

class Error extends Component {
    state = { visible: true }

    onDismiss = () => {
        this.setState({ visible: false });
    }

    render() {
        const { error } = this.props;
        const { visible } = this.state;


        if (!error || !error.message) {
            return null;
        }
        if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
            return error.networkError.result.errors.map((errorMessage, i) => (
                <Alert
                    color="danger"
                    isOpen={visible}
                    key={i}
                    toggle={this.onDismiss}
                >
                    {errorMessage.message.replace('GraphQL error: ', '')}
                </Alert>

            ));
        }
        return (
            <Alert
                color="danger"
                isOpen={visible}
                toggle={this.onDismiss}
            >
                {error.message.replace('GraphQL error: ', '')}
            </Alert>
        );

    }
}

Error.defaultProps = { error: {} };

Error.propTypes = { error: PropTypes.object };

export default Error;
