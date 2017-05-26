import React from 'react'
import { connect } from 'react-redux'

import App from "../components/App"
import { tagSelected } from "../actions/actions"

const mapStateToProps = (state) => {
  return {
    currentTag: state.get("currentTag"),
    tags: state.get("tags"),
    loader: state.get("loader")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTagSelected: function(tag) {
      dispatch(tagSelected(tag))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

