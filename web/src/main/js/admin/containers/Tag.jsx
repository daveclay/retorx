import React from 'react'
import { connect } from 'react-redux'

import { imagesSelected, editImages } from "../actions/actions"
import { loadImagesForTag } from "../../main/actions/imageApiActions"
import Tag from "../components/Tag"

const mapStateToProps = (state, ownProps) => {
  let tag = ownProps.tag
  return {
    tag,
    images: state.get("imagesByTag").get(tag)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (tag) => {
      dispatch(loadImagesForTag(tag))
    },
    onImagesSelected: (images) => {
      dispatch(imagesSelected(images))
    },
    onDoubleClickImages: (images) => {
      dispatch(editImages(images))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tag)
