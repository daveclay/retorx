import { fromJS } from 'immutable'

import { jsonApiFor } from "../../lib/api"
import {baseAboutContentServicePathBuilder, baseImageContentServicePathBuilder} from "../../lib/paths"
import { createImage } from "../../lib/imageData"

const aboutApi = jsonApiFor(baseAboutContentServicePathBuilder)
const imageApi = jsonApiFor(baseImageContentServicePathBuilder)

export const showAbout = () => {
  return {
    type: "SHOW_ABOUT"
  }
}

export const aboutLoaded = (about) => {
  return {
    type: "ABOUT_LOADED",
    about
  }
}

export const loadAbout = () => {
  return dispatch => {
    aboutApi.get("info")
      .then(about => {
        dispatch(aboutLoaded(about.data))
        hidePageLoader()
      })
  }
}

export const loadTags = () => {
  return dispatch => {
    imageApi.get("tags")
      .then((tags) => {
        dispatch(tagsLoaded(fromJS(tags)))
        hidePageLoader()
      })
  }
};

const hidePageLoader = () => {
  let elem = document.getElementById("page-loader")
  elem.style.display = "none"
};

export const loadImagesForTag = (tag) => {
  return dispatch => {
    dispatch(showContentLoader())
    updateGID(tag)

    let apiCall = (tag == "Latest Work") ?
      imageApi.get("latest") : imageApi.get("tag/" + tag);
    apiCall
      .then(images => {
        return fromJS(images).map(image => createImage(image))
      }).then(images => {
        dispatch(imagesLoaded(tag, images))
      }).catch(e => {
        console.log(e)
      }).then(() => {
        dispatch(hideContentLoader())
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

export const showContentLoader = () => {
  return {
    type: "SHOW_CONTENT_LOADER"
  }
}

export const hideContentLoader = () => {
  return {
    type: "HIDE_CONTENT_LOADER"
  }
}

const updateGID = (tag) => {
  window.location.hash = `&gid=${tag}`
}
