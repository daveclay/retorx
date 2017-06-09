import React from 'react'
import { connect } from 'react-redux'

import App from "../components/App"

const mapStateToProps = (state) => {
  return {
    tags: state.get("tags"),
    showAbout: state.get("showAbout"),
    showLoader: state.get("showLoader"),
  }
}

export default connect(mapStateToProps)(App)

