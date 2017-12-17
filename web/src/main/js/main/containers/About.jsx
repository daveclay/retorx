import React from 'react'
import { connect } from 'react-redux'

import About from "../components/About"

const mapStateToProps = (state) => {
  return {
    about: state.get("about")
  }
}

export default connect(mapStateToProps)(About)
