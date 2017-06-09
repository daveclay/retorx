import { fromJS } from 'immutable'

import { jsonApiFor } from "../../lib/api"
import { baseImageContentServicePathBuilder } from "../../lib/paths"
import { createImage } from "../../lib/imageData"

const imageApi = jsonApiFor(baseImageContentServicePathBuilder)

const withLoaderElement = (f) => {
  let elem = document.getElementsByClassName("loader-overlay-show")[0]
  if (elem) {
    f(elem)
  }
}

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

export const loadImagesForTag = (tag) => {
  return dispatch => {
    showLoader("")
    updateGID(tag)
    imageApi.get("tag/" + tag)
      .then(images => {
        return fromJS(images).map(image => createImage(image))
      }).then(images => {
        dispatch(imagesLoaded(tag, images))
      }).catch(e => {
        console.log(e)
      }).then(() => {
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

export const imagesSaved = () => {
  return {
    type: "IMAGES_SAVED",
  }
}

const updateGID = (tag) => {
  window.location.hash = `&gid=${tag}`
}

const showLoader = (message) => {
  withLoaderElement(loaderElement => {
    loaderElement.getElementsByClassName("message")[0].innerHTML = message
    loaderElement.style.display = "block"
  })
}

const hideLoader = () => {
  withLoaderElement(loaderElement => {
    loaderElement.style.display = "none"
  })
}


