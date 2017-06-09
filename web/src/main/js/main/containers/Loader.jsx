import React from 'react'

import { connect } from 'react-redux'

import Loader from "../components/Loader"

const mapStateToProps = (state) => {
  return {
    showLoader: state.get("showLoader")
  }
}

export default connect(mapStateToProps)(Loader)
