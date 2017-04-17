import React from 'react'
import { connect } from 'react-redux'

import Menu from "../components/Menu"

const mapStateToProps = (state) => {
  return {
    menuItems: state.get("menuItems")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function(menuItem) {
      dispatch(menuItem.get("action")())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
