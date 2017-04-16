import Immutable from "immutable"

import { chainReducers, map } from './utils/chainReducers'

const menuItemSelected = (state, action) => {
  console.log(action)
  return state
}

const tagSelected = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  return state.set("imagesByTag", imagesByTag.set(action.tag, Immutable.List()))
}

const tagsLoaded = (state, action) => {
  console.log(action)
  return state.set("tags", action.tags)
}

const imagesSelected = (state, action) => {
  console.log(action)
  return state.set("selectedImages", action.images)
}

const imagesLoaded = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  return state.set("imagesByTag", imagesByTag.set(action.tag, action.images))
}

const imageLoaded = (state, action) => {
  return state
}

const thumbnailLoaded = (state, action) => {
  let image = action.image
  let imagesByTag = state.get("imagesByTag")
  let tag = image.get("tags").get(0);
  let images = imagesByTag.get(tag)
  let updatedImages = images.update(images.indexOf(action.image), () => action.image.set("loaded", true))

  let updatedImagesByTag = imagesByTag.set(tag, updatedImages)
  return state.set("imagesByTag", updatedImagesByTag)
}

export default chainReducers(
  map("MENU_ITEM_SELECTED").to(menuItemSelected),
  map("TAGS_LOADED").to(tagsLoaded),
  map("TAG_SELECTED").to(tagSelected),
  map("IMAGES_LOADED").to(imagesLoaded),
  map("IMAGES_SELECTED").to(imagesSelected),
  map("THUMBNAIL_LOADED").to(thumbnailLoaded)
)

