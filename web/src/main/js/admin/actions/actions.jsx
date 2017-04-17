import Immutable from "immutable"

import { jsonApiFor } from "../lib/api"
import { baseServicesPath } from "../../main/constants/constants"
import {
  imageLoaded
} from "../../main/actions/imageApiActions"

const adminApi = jsonApiFor(baseServicesPath + "admin")
import {
  buildEditorProperties,
  buildPropertiesJson
} from "../lib/properties"

export const tagSelected = (tagName) => {
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
export const closeSingleImageEditor = () => {
  return {
    type: "CLOSE_SINGLE_IMAGE_EDITOR"
  }
}

export const closeMultipleImageEditor = () => {
  return {
    type: "CLOSE_MULTIPLE_IMAGE_EDITOR"
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
    dispatch(showLoader(true))
    adminApi.get("/reloadTags").then(() => {
      console.log("reloaded tags?")
      dispatch(showLoader(false))
    })
  }
}

export const reloadFiles = () => {
  return dispatch => {
    dispatch(showLoader(true))
    adminApi.get("/reloadFromFiles").then(() => {
      console.log("reloaded!")
      dispatch(showLoader(false))
    })
  }
}

export const renameTag = (existingTag, tagField) => {
  return dispatch => {
    dispatch(showLoader(true))
    adminApi.post({
      url: "/rename/" + existingTag,
      data: tagField.val(),
    })
      .then(() => {
        console.log("hi.")
      })
  }
}

export const saveMultipleImageProperties = (images, editorProperties) => {
  return dispatch => {
    var count = 0;
    let total = images.size
    dispatch(showLoader(true, `Saving ${total} images`))
    let promises = images.map(image => {
      let imageProperties = image.get("properties")
      let existingEditorProperties = buildEditorProperties(imageProperties)
      return saveProperties(image, existingEditorProperties.merge(editorProperties)).then(() => {
        count++;
        dispatch(showLoader(true, `Saved ${count} of ${total}`))
      })
    })
    Promise.all(promises).then(() => {
      dispatch(closeMultipleImageEditor())
      dispatch(showLoader(false))
    })
  }
}

export const saveSingleImageProperties = (image, editorProperties) => {
  return dispatch => {
    dispatch(showLoader(true, `Saving ${image.get("name")}`))
    saveProperties(image, editorProperties).then(updatedImage => {
      dispatch(imageLoaded(updatedImage))
    }).then(() => {
      dispatch(closeSingleImageEditor())
      dispatch(showLoader(false))
    })
  }
}

const saveProperties = (image, editorProperties) => {
  return adminApi.post({
      url: "/" + image.get("name") + "/properties",
      data: JSON.stringify(buildPropertiesJson(editorProperties)),
    }).then(updatedPojoImage => {
      return Immutable.fromJS(updatedPojoImage)
    }).then(updatedImage => {
      console.log(`saved properties for ${updatedImage.get("name")}`);
      return updatedImage
    })
}

export const addImageProperty = () => {
  return {
    type: "ADD_IMAGE_PROPERTY"
  }
}

export const deleteImageProperty = (id) => {
  return {
    type: "DELETE_IMAGE_PROPERTY",
    id
  }
}

export const changeImagePropertyName  = (id, newName) => {
  return {
    type: "CHANGE_IMAGE_PROPERTY_NAME",
    id,
    newName
  }
}

export const changeImagePropertyValue = (id, value) => {
  return {
    type: "CHANGE_IMAGE_PROPERTY_VALUE",
    id,
    value
  }
}

export const imagesSelected = (images) => {
  return {
    type: "IMAGES_SELECTED",
    images
  }
}

export const editImages = (images) => {
  return {
    type: "EDIT_SELECTED",
    images
  }
}

export const showLoader = (show, message = "") => {
  return {
    type: "SHOW_LOADER",
    show,
    message
  }
}

export const editSelected = () => {
  return {
    type: "EDIT_SELECTED"
  }
}

