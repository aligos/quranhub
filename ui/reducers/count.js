import { INCREMENT_COUNT } from '../actions/incrementCount';

export default function(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNT:
      return state + 1;
    default:
      return state;
  }
};
