import { jsonApiFor } from "../lib/api"
import { baseServicesPath } from "../../main/constants/constants"

const adminApi = jsonApiFor(baseServicesPath + "admin/")

export const tagSelected = (tagName, images) => {
  return {
    type: "TAG_SELECTED",
    tagName
  }
}

export const initialize = () => {
  return {
    type: "INITIALIZE"
  }
}

export const menuItemSelected = (menuItem) => {
  return {
    type: "MENU_ITEM_SELECTED",
    menuItem
  }
}

export const uploadImage = () => {
  return dispatch => {
    adminApi.post({
      url: "/image",
    }).then(() => {
      console.log("uploaded")
    })
  }
}

export const reloadTags = () => {
  return dispatch => {
    adminApi.get({
      url: "/reloadTags",
    }).then(() => {
      console.log("reloaded tags?")
    })
  }
}

export const reloadFiles = () => {
  return dispatch => {
    adminApi.get({
      url: "/reloadFromFiles",
    }).then(() => {
      console.log("reloaded!")
    })
  }
}

export const renameTag = (existingTag, tagField) => {
  return dispatch => {
    adminApi.post({
      url: "/rename/" + existingTag,
      data: tagField.val(),
    })
      .then(() => {
        console.log("hi.")
      })
  }
}

export const createTagImage = (tag) => {
  return dispatch => {
    adminApi.post({
      url: "/tag/image/" + tag,
    }).then(() => {
      console.log("create tag")
    })
  }
}

export const saveProperties = (image, properties) => {
  return dispatch => {
    adminApi.post({
      url: "/" + image.name + "/properties",
      data: JSON.stringify(properties),
    }).then(() => {
      console.log("saved properties");
    })
  }
}

export const imagesSelected = (images) => {
  return {
    type: "IMAGES_SELECTED",
    images
  }
}

export const thumbnailLoaded = (image) => {
  return {
    type: "THUMBNAIL_LOADED",
    image
  }
}