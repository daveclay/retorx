import React from 'react'
import { connect } from 'react-redux'

import DropdownMenu from "../components/DropdownMenu"

import {
  loadImagesForTag
} from "../actions/imageApiActions"

const mapStateToProps = (state) => {
  return {
    currentTag: state.get("currentTag"),
    tags: state.get("tags")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function(tag) {
      dispatch(loadImagesForTag(tag))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu)
