import Immutable from "immutable"

import { chainReducers, map } from '../../lib/chainReducers'
import {
  setImageEditorProperties,
  upsertImageEditorPropertyById,
  deleteImageEditorPropertyById,
  upsertEditorPropertyName,
  upsertEditorPropertyValue,
} from "../lib/properties"

const showLoader = (state, action) => {
  return state.set("loader", Immutable.Map({
    show: action.show,
    message: action.message
  }))
}

const openAddImage = (state, action) => {
  let imageProperties = Immutable.Map({
    date: new Date().toLocaleDateString(),
    tags: state.get("currentTag") || "",
    name: "Untitled",
  })
  return setImageEditorProperties(state.set("openSingleImageEditor", true), imageProperties)
}

const imageFilesSelected = (state, action) => {
  return state.set("selectedImageFiles", action.files)
}

const editSelected = (state, action) => {
  console.log(action)
  let selectedImages = state.get("selectedImages");
  return openImageEditor(state, selectedImages)
}

const openImageEditor = (state, selectedImages) => {
  if (selectedImages.size > 1) {
    let properties = Immutable.Map({
      "": ""
    })
    // TODO: Merge common props into a single form, ignore different values?
    return setImageEditorProperties(state.set("openMultipleImageEditor", true), properties)
  } else if (selectedImages.size == 1) {
    let image = selectedImages.get(0);
    let imageProperties = image.get("properties")
    return setImageEditorProperties(state.set("openSingleImageEditor", true), imageProperties)
  } else {
    return state;
  }
}

const changeImagePropertyName = (state, action) => {
  let modifier = upsertEditorPropertyName(action)
  return upsertImageEditorPropertyById(action.id, modifier)(state)
}

const changeImagePropertyValue = (state, action) => {
  let modifier = upsertEditorPropertyValue(action)
  return upsertImageEditorPropertyById(action.id, modifier)(state)
}

const addImageProperty = (state) => {
  let editorProperties = state.get("imageEditorProperties")
  let nextId = String(editorProperties.size)
  let action = {
    id: nextId,
    name: "",
    value: ""
  }
  return changeImagePropertyValue(state, action)
}

const deleteImageProperty = (state, action) => {
  return deleteImageEditorPropertyById(action.id)(state)
}

const tagSelected = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  return state.set("currentTag", action.tag)
}

const tagsLoaded = (state, action) => {
  return state.set("tags", action.tags)
}

const imagesSelected = (state, action) => {
  return state.set("selectedImages", Immutable.List(action.images))
}

const imagesLoaded = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  return state.set("imagesByTag", imagesByTag.set(action.tag, action.images))
}

const imageLoaded = (state, action) => {
  return state.set("imagesByTag", Immutable.Map())
}

const closeMultipleImageEditor = (state) => {
  return state.set("openMultipleImageEditor", false)
}

const closeSingleImageEditor = (state) => {
  return state.set("openSingleImageEditor", false)
}

const tagsReloaded = (state, action) => {
  return state.set("imagesByTag", Immutable.Map())
}

export default chainReducers(
  map("EDIT_SELECTED").to(editSelected),
  map("TAGS_LOADED").to(tagsLoaded),
  map("TAG_SELECTED").to(tagSelected),
  map("IMAGE_LOADED").to(imageLoaded),
  map("IMAGES_LOADED").to(imagesLoaded),
  map("IMAGES_SELECTED").to(imagesSelected),
  map("CLOSE_MULTIPLE_IMAGE_EDITOR").to(closeMultipleImageEditor),
  map("CLOSE_SINGLE_IMAGE_EDITOR").to(closeSingleImageEditor),
  map("CHANGE_IMAGE_PROPERTY_NAME").to(changeImagePropertyName),
  map("CHANGE_IMAGE_PROPERTY_VALUE").to(changeImagePropertyValue),
  map("ADD_IMAGE_PROPERTY").to(addImageProperty),
  map("DELETE_IMAGE_PROPERTY").to(deleteImageProperty),
  map("SHOW_LOADER").to(showLoader),
  map("TAGS_RELOADED").to(tagsReloaded),
  map("OPEN_ADD_IMAGE").to(openAddImage),
  map("IMAGE_FILES_SELECTED").to(imageFilesSelected),
)

