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

export const loadTags = () => {
  return dispatch => {
    imageApi.get("tags")
      .then((tags) => {
        dispatch(tagsLoaded(fromJS(tags)))
      })
  }
};

const hideLoader = () => {
  let body = document.getElementsByTagName("body")[0]
  let loaderElement = document.getElementsByClassName("loader-overlay-show")[0]
  body.removeChild(loaderElement)
}

export const loadImagesForTag = (tag) => {
  return dispatch => {
    imageApi.get("tag/" + tag)
      .then(images => {
        return fromJS(images).map(image => createImage(image))
      }).then(images => {
        dispatch(imagesLoaded(tag, images))
        hideLoader()
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
