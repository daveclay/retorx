import React from 'react'
import { connect } from 'react-redux'

import Menu from "../components/Menu"
import { tagSelected } from "../actions/actions"

const mapStateToProps = (state) => {
  return {
    currentTag: state.get("currentTag"),
    tags: state.get("tags"),
    menuItems: state.get("menuItems")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tagSelected: function(tag) {
      dispatch(tagSelected(tag))
    },

    onSelect: function(menuItem) {
      dispatch(menuItem.get("action")())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
