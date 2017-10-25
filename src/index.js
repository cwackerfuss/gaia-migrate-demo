import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import App from './components/App'
import reducers from 'state/reducers'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const logger = createLogger({
  predicate: (getState, action) => !!action.type
});

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(logger, thunk))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
