import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { clearPlayerAction } from '../actions';
import Header from './Header';

class Score extends React.Component {
  constructor(props) {
    super(props);
    this.storageRanking = this.storageRanking.bind(this);
  }

  componentDidMount() {
    this.storageRanking();
  }

  storageRanking() {
    const { name, score, hash } = this.props;
    const newPlayerRank = {
      name,
      score,
      picture: `https://www.gravatar.com/avatar/${hash}`,
    };
    if (!localStorage.getItem('ranking')) {
      localStorage.setItem('ranking', JSON.stringify([newPlayerRank]));
    } else {
      const addRankings = [...JSON.parse(localStorage.getItem('ranking')), newPlayerRank];
      localStorage.setItem('ranking', JSON.stringify(addRankings));
    }
  }

  // [HA] Consulta do PR https://github.com/tryber/sd-05-project-trivia-react-redux-4/pull/14/files.

  render() {
    const { clearPlayer, assertions, score } = this.props;
    return (
      <div>
        <Header />
        <section className="message">
          <h2>Feedback message:</h2>
          {(assertions >= 3) && <p data-testid="feedback-text">You rock!</p>}
          {(assertions < 3) && <p data-testid="feedback-text">Could be better...</p>}
          <h2>See your results:</h2>
          <p>Your total score is <span data-testid="feedback-total-score">{score}</span> points.</p>
          <p>
            You got <span data-testid="feedback-total-question">{assertions}</span> answers right.
          </p>
        </section>
        <section className="buttons-feedback">
        <Link to="/">
          <button className="transition-button" type="button" data-testid="btn-play-again" onClick={() => clearPlayer('', '', 0, 0)}>
            Play again
          </button>
        </Link>
        <Link to="/ranking">
          <button className="transition-button" type="button" data-testid="btn-ranking">
            See ranking
          </button>
        </Link>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assertions: state.dataPlayerReducer.assertions,
  name: state.dataPlayerReducer.name,
  score: state.dataPlayerReducer.score,
  hash: MD5(state.dataPlayerReducer.email).toString(),
});

const mapDispatchToProps = (dispatch) => ({
  clearPlayer: (n, e, s, a) => dispatch(clearPlayerAction(n, e, s, a)),
});

Score.propTypes = {
  name: propTypes.string.isRequired,
  hash: propTypes.string.isRequired,
  score: propTypes.number.isRequired,
  assertions: propTypes.number.isRequired,
  clearPlayer: propTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Score);
