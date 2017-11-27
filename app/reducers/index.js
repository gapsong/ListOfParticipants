import { combineReducers } from 'redux';
import messages from './messages';
import participants from './participants';

export default combineReducers({
  messages,
  participants
});
