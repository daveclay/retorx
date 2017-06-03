import Immutable from "immutable"

import { jsonApiFor } from "../../lib/api"
import { baseAdminContentServicePathBuilder } from "../../lib/paths"
import {
  imageLoaded
} from "../../main/actions/imageApiActions"

const handleJSONError = (err) => {
  console.error(err)
  if (err.message) {
    alert(err.message)
  } else if (err.responseText) {
    alert(err.responseText)
  } else {
    alert(err)
  }
}

const adminApi = jsonApiFor(baseAdminContentServicePathBuilder)
import {
  buildEditorProperties,
  addEditorPropertiesToFormData
} from "../lib/properties"

export const tagSelected = (tag) => {
  return {
    type: "TAG_SELECTED",
    tag
  }
}

export const openAddImage = () => {
  return {
    type: "OPEN_ADD_IMAGE",
  }
}

export const closeImageUploader = () => {
  return {
    type: "CLOSE_IMAGE_UPLOADER"
  }
}

export const imageFilesSelected = (files) => {
  return {
    type: "IMAGE_FILES_SELECTED",
    files
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

export const saveImage = (image, editorProperties, files) => {
  return dispatch => {
    const withFile = (f) => {
      if (files && files.length > 0) {
        return f(files[0])
      }
    }

    let filename = withFile(file => {
      return file.name.indexOf(".") > -1 ?
        file.name.substring(0, file.name.lastIndexOf('.')) :
        file.name;
    })

    let name = image ? image.get("name") : filename

    dispatch(showLoader(true, `Saving ${name}`))

    let formData = new FormData();

    withFile(file => {
      formData.append("image", file)
    })

    addEditorPropertiesToFormData(editorProperties, formData)

    saveImageData(name, image, editorProperties, formData)
      .then(savedPojoImage => {
        return Immutable.fromJS(savedPojoImage)
      }).then(savedImage => {
      console.log(`saved image ${savedImage.get("name")}`);
      dispatch(closeSingleImageEditor())
      dispatch(imageLoaded(savedImage))
    }).catch(err => {
      handleJSONError(err)
    }).then(() => {
      dispatch(showLoader(false))
    })
  }
}

const saveImageData = (name, image, editorProperties, formData = new FormData()) => {
  addEditorPropertiesToFormData(editorProperties, formData)
  return adminApi.send({
    method: image ? "PUT" : "POST",
    path: `image/${name}`,
    headers: {},
    data: formData
  })
}

export const reloadTags = () => {
  return dispatch => {
    dispatch(showLoader(true))
    adminApi.get("reloadTags").then(() => {
      console.log("reloaded tags?")
      dispatch(showLoader(false))
    }).catch(err => {
      handleJSONError(err)
    }).then(() => {
      dispatch(showLoader(false))
    })
  }
}

export const reloadFiles = () => {
  return dispatch => {
    dispatch(showLoader(true))
    adminApi.get("reloadFromFiles").then(() => {
      console.log("reloaded!")
      dispatch(showLoader(false))
    }).catch(err => {
      handleJSONError(err)
    }).then(() => {
      dispatch(showLoader(false))
    })
  }
}

export const saveMultipleImageProperties = (images, editorProperties) => {
  return dispatch => {
    var count = 0;
    let total = images.size
    dispatch(showLoader(true, `Saving ${total} images`))
    let promises = images.map(image => {
      let name = image.get("name");

      let imageProperties = image.get("properties")
      let existingEditorProperties = buildEditorProperties(imageProperties)
      return saveImageData(name, image, existingEditorProperties.merge(editorProperties)).then(() => {
        count++;
        dispatch(showLoader(true, `Saved ${name} - ${count} of ${total}`))
      })
    })
    Promise.all(promises).then(() => {
      dispatch(closeMultipleImageEditor())
      dispatch(showLoader(false))
    }).catch(err => {
      handleJSONError(err)
    }).then(() => {
      dispatch(showLoader(false))
    })
  }
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

