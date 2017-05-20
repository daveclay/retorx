import React from 'react'
import { connect } from 'react-redux'

import {
  addImage,
  closeImageUploader,
  imageSelected,
} from "../actions/actions"

import ImageUploader from "../components/ImageUploader"

const mapStateToProps = (state) => {
  return {
    selectedImageFiles: state.get("selectedImageFiles"),
    showUploader: state.get("openImageUploader"),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClose: function() {
      dispatch(closeImageUploader())
    },
    onFileSelected: function(files) {
      dispatch(imageSelected(files))
    },
    onSave: function(files) {
      dispatch(addImage(files))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageUploader)

