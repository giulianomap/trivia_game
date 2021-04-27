export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const DATA_TOKEN = 'DATA_TOKEN';
export const REQUEST_TRIVIA = 'REQUEST_TRIVIA';
export const DATA_TRIVIA = 'DATA_TRIVIA';
export const FAILURE = 'FAILURE';
export const DATA_PLAYER = 'DATA_PLAYER';
export const ANSWERED = 'ANSWERED';
export const CLEAR = 'CLEAR';
export const GET_SCORE = 'GET_SCORE';
export const CLEAR_SCORE = 'CLEAR_SCORE';
export const SET_TIME = 'SET_TIME';

export function dataPlayerAction(name, email) {
  return {
    type: DATA_PLAYER,
    name,
    email,
  };
}

export function requestTokenAction() {
  return {
    type: REQUEST_TOKEN,
  };
}

export function successTokenAction(tok) {
  return {
    type: DATA_TOKEN,
    tok,
  };
}

export function requestTriviaAction() {
  return {
    type: REQUEST_TRIVIA,
  };
}

export function successTriviaAction(dataGame) {
  return {
    type: DATA_TRIVIA,
    dataGame,
  };
}

export function failureAllAction(error) {
  return {
    type: FAILURE,
    error,
  };
}

const apiToken = 'https://opentdb.com/api_token.php?command=request';
export function fetchTokenThunk() {
  return (dispatch) => {
    dispatch(requestTokenAction());
    return fetch(apiToken)
      .then((response) => response.json())
      .then(
        (data) => {
          console.log(data.token);
          return dispatch(successTokenAction(data.token));
        },
        // (error) => dispatch(failureAllAction(error)),
        // aparentemente nem precisa de error nessas apis
      );
  };
}

const apiTrivia = 'https://opentdb.com/api.php?amount=5&token=';
export function fetchTriviaThunk(token) {
  return (dispatch) => {
    dispatch(requestTriviaAction());
    return fetch(`${apiTrivia}${token}`)
      .then((response) => response.json())
      .then(
        (data) => {
          console.log(data);
          return dispatch(successTriviaAction(data.results));
        },
        // (error) => dispatch(failureAllAction(error)),
      );
  };
}

export function answeredAction() {
  return {
    type: ANSWERED,
  };
}

export function clearAction() {
  return {
    type: CLEAR,
  };
}

export function playerScoreAction(points) {
  return {
    type: GET_SCORE,
    points,
  };
}

export function clearPlayerAction(name, email, score, assertions) {
  return {
    type: CLEAR_SCORE,
    name,
    email,
    score,
    assertions,
  };
}

// export function timerAction(count) {
//   return {
//     type: SET_TIME,
//     count,
//   };
// }
