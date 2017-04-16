import { fromJS } from 'immutable'

import { jsonApiFor } from "../../admin/lib/api"
import { transformImage, transformImages } from "../../admin/lib/imageData"
import { baseImageContentServicePath } from "../constants/constants"

const imageApi = jsonApiFor(baseImageContentServicePath)

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
        return fromJS(images)
      }).then(images => {
        dispatch(imagesLoaded(tag, images))
      })
  }
};

export const loadLatestImages = () => {
  return dispatch => {
    imageApi.get("latest").then(images => {
      dispatch(imagesLoaded(images))
    })
  }
};

export const loadImageContent = (id) => {
  return dispatch => {
    imageApi.get(`data/${id}`)
      .then(image => {
        dispatch(imageLoaded(image))
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
    image: transformImage(image)
  }
}
