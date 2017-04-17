import React from 'react'
import { connect } from 'react-redux'

import {
  closeSingleImageEditor,
  changeImagePropertyName,
  changeImagePropertyValue,
  addImageProperty,
  deleteImageProperty,
  saveSingleImageProperties,
} from "../actions/actions"

import SingleImageEditor from "../components/SingleImageEditor"

const mapStateToProps = (state) => {
  let showEditor = state.get("openSingleImageEditor")
  let selectedImages = state.get("selectedImages")
  let image = showEditor ? selectedImages.get(0) : null
  return {
    showEditor: state.get("openSingleImageEditor"),
    properties: state.get("imageEditorProperties"),
    image: image
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: function() {
      dispatch(closeSingleImageEditor())
    },
    onSave: function(image, properties) {
      dispatch(saveSingleImageProperties(image, properties))
    },
    onChangeName: function(id, newName) {
      dispatch(changeImagePropertyName(id, newName))
    },
    onChangeValue: function(id, value) {
      dispatch(changeImagePropertyValue(id, value))
    },
    onDeleteProperty: function(id) {
      dispatch(deleteImageProperty(id))
    },
    onAddProperty: function() {
      dispatch(addImageProperty())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleImageEditor)

