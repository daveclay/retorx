import { fromJS } from 'immutable'

import { jsonApiFor } from "../../lib/api"
import { baseImageContentServicePathBuilder } from "../../lib/paths"
import { createImage } from "../../lib/imageData"

const imageApi = jsonApiFor(baseImageContentServicePathBuilder)

export const showAbout = () => {
  return {
    type: "SHOW_ABOUT"
  }
}

export const loadAllTags = () => {
  return dispatch => {
    imageApi.get("tags")
      .then((tags) => {
        dispatch(tagsLoaded(fromJS(tags)))
      })
  }
};

export const loadImagesForTag = (tag) => {
  return dispatch => {
    imageApi.get("tag/" + tag)
      .then(images => {
        return fromJS(images).map(image => createImage(image))
      }).then(images => {
        dispatch(imagesLoaded(tag, images))
      })
  }
};

export const tagsLoaded = (tags) => {
  return {
    type: "TAGS_LOADED",
    tags: tags
  }
}

export const imagesLoaded = (tag, images) => {
  return {
    type: "IMAGES_LOADED",
    tag,
    images: images
  }
}

export const imageLoaded = (image) => {
  return {
    type: "IMAGE_LOADED",
    image: image
  }
}
