import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import Answers from './Answers';
import { clearAction, answeredAction } from '../actions';
import decodeEntities from '../services/decodeEntities';
import shuffleArray from '../services/shuffleArray';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      i: 0,
      count: 30,
      numberQuestions: 1,
      randomAnswers: [],
    };
    this.shuffle = this.shuffle.bind(this);
    this.next = this.next.bind(this);
    this.beginTimer = this.beginTimer.bind(this);
  }

  componentDidMount() {
    this.beginTimer();
    console.log('component game did mount');
    // this.shuffle(); 
    // could only randomize from 2nd question on, to wait for api to be charged
  }

  componentDidUpdate() {
    const { count } = this.state;
    const { answeredOne, answerRedux } = this.props;
    if ( count === 0 || answeredOne) {
      clearInterval(this.myInterval);
      answerRedux();
    }
  }

  beginTimer() {
    clearInterval(this.myInterval);
    this.myInterval = setInterval(() => {
      this.setState((prevState) => ({
        count: Math.max(prevState.count - 1, 0) }));
    }, 1000);
  }
  // [HA]{Tela Game, R5: timer} Modelo - https://www.youtube.com/watch?v=NAx76xx40jM .

  shuffle() {
    const { dataGame } = this.props;
    const { i } = this.state;
    const correct = dataGame[i+1].correct_answer;
    const incorrect = dataGame[i+1].incorrect_answers;
    const allAnswers = [...incorrect, correct];
    const randomAllAnswers = shuffleArray(allAnswers);
    this.setState({ randomAnswers: randomAllAnswers });
  }

  next() {
    // reset the answeredOne state because not answered yet
    const { clearAnswered } = this.props;
    clearAnswered();
    // reset the timer
    this.setState({ count: 30 });
    this.beginTimer();
    // mark the total number of questions already displayed
    const { numberQuestions } = this.state;
    this.setState({ numberQuestions: numberQuestions + 1 });
    // shuffle new set of questions
    if (numberQuestions < 5) {
      this.shuffle();
    }
    // go to next question according to its index
    const { i } = this.state;
    if (i < 4) {
      return this.setState({ i: i + 1 });
    } else if (i === 4) {
      return this.setState({ i: 0 });
    }
    return this.setState({ i });
  }


  render() {
    const { dataGame, isFetching, answeredOne } = this.props;
    const { i, count, numberQuestions } = this.state;
    return (
      <div>
        {isFetching && <p>Loading...</p>}
        {!isFetching && dataGame.length > 0 && (
          <section className="game">
            <div>
            <Header />
            <div className="question">
            <h3 data-testid="question-category">CATEGORY - {decodeEntities(dataGame[i].category)}</h3>
            <h3 data-testid="question-text">QUESTION - {decodeEntities(dataGame[i].question)}</h3>
            </div>
            <Answers
              correct={dataGame[i].correct_answer}
              incorrect={dataGame[i].incorrect_answers}
              randomAnswers={this.state.randomAnswers}
              i={i}
              timecount={count}
              level={dataGame[i].difficulty}
            />
            </div>
            <h3 className="timer">Time left: {count}</h3>
          </section>
        )}
        {answeredOne && (
          <button className="transition-button" data-testid="btn-next" onClick={this.next}>
            NEXT
          </button>
        )}
        {numberQuestions === 6 && <Redirect to="/score" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataGame: state.fetchApis.dataGame,
  isFetching: state.fetchApis.isFetching,
  answeredOne: state.answeredReducer.answeredOne,
  // timecount: state.timeReducer.count,
  // finally chose local state over stored state for timer
});

const mapDispatchToProps = (dispatch) => ({
  clearAnswered: (e) => dispatch(clearAction(e)),
  answerRedux: (e) => dispatch(answeredAction(e)),
  // getTimer: (count) => dispatch(timerAction(count)),
});

Game.propTypes = {
  dataGame: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFetching: PropTypes.bool.isRequired,
  answeredOne: PropTypes.bool.isRequired,
  timecount: PropTypes.number.isRequired,
  clearAnswered: PropTypes.func.isRequired,
  answerRedux: PropTypes.func.isRequired,
  getTimer: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
