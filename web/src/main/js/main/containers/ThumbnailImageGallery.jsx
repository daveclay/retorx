import React from 'react'

import { connect } from 'react-redux'

import ThumbnailImageGallery from "../components/ThumbnailImageGallery"

import {
  loadImagesForTag
} from "../actions/imageApiActions"

const mapStateToProps = (state) => {
  let tag = state.get("currentTag")
  return {
    tag,
    images: state.get("imagesByTag").get(tag)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect: function(tag) {
      dispatch(loadImagesForTag(tag))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailImageGallery)
