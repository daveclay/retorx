import React from 'react'

import "../../css/adminStyles.css"

import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { initialize } from "./actions/actions"
import { loadAllTags } from "./actions/actions"
import reducers from './reducers/reducers'
import App from './containers/App'
import InitialState from './InitialState'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  InitialState,
  composeEnhancers(
    applyMiddleware(thunkMiddleware),
  )
)
store.dispatch(initialize())
store.dispatch(loadAllTags())

if (typeof document !== 'undefined') {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
} else {
  console.log("No document")
}