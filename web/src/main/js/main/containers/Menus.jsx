import React from 'react'
import { connect } from 'react-redux'

import SidebarMenu from "../components/SidebarMenu"
import DropdownMenu from "../components/DropdownMenu"

import {
  loadImagesForTag,
  showAbout
} from "../actions/imageApiActions"

const mapStateToProps = (state) => {
  return {
    currentTag: state.get("currentTag"),
    showAbout: state.get("showAbout"),
    tags: state.get("tags")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function(tag) {
      dispatch(loadImagesForTag(tag))
    },
    onSelectAbout: function() {
      dispatch(showAbout())
    }
  }
}

export const ConnectedSidebarMenu = connect(mapStateToProps, mapDispatchToProps)(SidebarMenu)
export const ConnectedDropdownMenu = connect(mapStateToProps, mapDispatchToProps)(DropdownMenu)
