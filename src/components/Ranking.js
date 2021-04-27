import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MD5 } from 'crypto-js';
import { clearPlayerAction } from '../actions';

class Ranking extends React.Component {
  render() {
    const totalRanking = JSON.parse(localStorage.getItem('ranking'));
    const orderedRanking = totalRanking.sort((a, b) => b.score - a.score);
    const { clearPlayer } = this.props;
    return (
      <div>
        <h1 className="title-rank" data-testid="ranking-title">Here is the Great Trivia Ranking!</h1>
        <ol>
          {orderedRanking.map((player, index) => (
            <li className="each-rank">
              <img className="gravatar" src={`https://www.gravatar.com/avatar/${MD5(player.email).toString()}`} alt="" />
              <p data-testid={`player-name-${index}`}>- PLAYER: {player.name} -</p>
              <p data-testid={`player-score-${index}`}>-- SCORE: {player.score}.</p>
            </li>
          ))}
        </ol>
        <Link to="/">
          <button className="transition-button" type="button" data-testid="btn-go-home" onClick={() => clearPlayer('', '', 0, 0)}>
            Play again
          </button>
        </Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  clearPlayer: (n, e, s, a) => dispatch(clearPlayerAction(n, e, s, a)),
});

Ranking.propTypes = {
  clearPlayer: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Ranking);
