import React from 'react'
import { connect } from 'react-redux'
import { menuItemSelected } from "../actions/actions"

import Menu from "../components/Menu"

const mapStateToProps = (state) => {
  return {
    menuItems: state.get("menuItems")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function(menuItem) {
      dispatch(menuItemSelected(menuItem))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
