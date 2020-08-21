import React from 'react';
import propTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { dataPlayerAction, fetchTokenThunk, fetchTriviaThunk } from '../actions';
import LinkSettings from './LinkSettings';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      goToGame: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.provokeApis = this.provokeApis.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  provokeApis() {
    const { getDataPlayer, getToken, getTrivia, token } = this.props;
    const { name, email } = this.state;
    getDataPlayer(name, email);
    // promise para ter as duas requisiçoes na sequência certa
    getToken().then(() => {
      getTrivia(token);
      localStorage.setItem('token', token);
    });
    this.setState({ goToGame: true });
  }

  render() {
    const { name, email, goToGame } = this.state;
    return (
      <div>
        {goToGame && <Redirect to="/game" />}
        <input
          type="text"
          placeholder="name"
          data-testid="input-player-name"
          name="name"
          onChange={this.handleChange}
        />
        <input
          type="email"
          placeholder="email"
          data-testid="input-gravatar-email"
          name="email"
          onChange={this.handleChange}
        />
        <button
          type="button"
          data-testid="btn-play"
          disabled={!(name && email)}
          onClick={this.provokeApis}
        >
          Jogar
        </button>
        <LinkSettings />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.fetchApis.token,
});

const mapDispatchToProps = (dispatch) => ({
  getDataPlayer: (name, email) => dispatch(dataPlayerAction(name, email)),
  getToken: (e) => dispatch(fetchTokenThunk(e)),
  getTrivia: (tokn) => dispatch(fetchTriviaThunk(tokn)),
});

Player.propTypes = {
  token: propTypes.string.isRequired,
  getDataPlayer: propTypes.func.isRequired,
  getToken: propTypes.func.isRequired,
  getTrivia: propTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
