import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

store.subscribe(() => {
  console.debug('State change:', store.getState());
});

export default () => store