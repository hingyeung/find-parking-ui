import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

export default () => {
  return createStore(
    reducer,
    applyMiddleware(thunk)
  );
}