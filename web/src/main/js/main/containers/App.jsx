import React from 'react'
import { connect } from 'react-redux'

import App from "../components/App"

const mapStateToProps = (state) => {
  return {
    tags: state.get("tags"),
    loader: state.get("loader")
  }
}

export default connect(mapStateToProps)(App)

