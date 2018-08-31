import reduxThunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware';

export default [reduxThunk, reduxPromiseMiddleware()];
