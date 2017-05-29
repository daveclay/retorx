import React from 'react'

import { connect } from 'react-redux'

import AboutMenuItem from "../components/AboutMenuItem"

import {
  showAbout
} from "../actions/imageApiActions"

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function() {
      dispatch(showAbout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutMenuItem)
