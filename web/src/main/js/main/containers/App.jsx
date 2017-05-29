import React from 'react'
import { connect } from 'react-redux'

import App from "../components/App"

const mapStateToProps = (state) => {
  return {
    tags: state.get("tags"),
    showAbout: state.get("showAbout"),
    loader: state.get("loader")
  }
}

export default connect(mapStateToProps)(App)

