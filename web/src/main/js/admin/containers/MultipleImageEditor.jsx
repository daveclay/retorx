import React from 'react'
import { connect } from 'react-redux'

import {
  closeMultipleImageEditor,
  saveMultipleImageProperties,
  addImageProperty,
  deleteImageProperty,
  changeImagePropertyName,
  changeImagePropertyValue
} from "../actions/actions"
import MultipleImageEditor from "../components/MultipleImageEditor"

const mapStateToProps = (state) => {
  return {
    showEditor: state.get("openMultipleImageEditor"),
    properties: state.get("imageEditorProperties"),
    images: state.get("selectedImages")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: function() {
      dispatch(closeMultipleImageEditor())
    },
    onSave: function(images, properties) {
      dispatch(saveMultipleImageProperties(images, properties))
    },
    onAddProperty: function() {
      dispatch(addImageProperty())
    },
    onDeleteProperty: function(id) {
      dispatch(deleteImageProperty(id))
    },
    onChangeName: function(id, name) {
      dispatch(changeImagePropertyName(id, name))
    },
    onChangeValue: function(id, value) {
      dispatch(changeImagePropertyValue(id, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultipleImageEditor)

