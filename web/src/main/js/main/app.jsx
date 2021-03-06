import React from 'react'

import 'react-photoswipe/lib/photoswipe.css';
import "../../css/styles.css"

import thunkMiddleware from 'redux-thunk'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import {
  loadImagesForTag,
  loadTags,
  loadAbout
} from "../main/actions/imageApiActions"
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

store.dispatch(loadTags())
store.dispatch(loadImagesForTag(InitialState.get("initialTag")))
store.dispatch(loadAbout())

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

