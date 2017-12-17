import Immutable from "immutable"

import { chainReducers, map } from '../../lib/chainReducers'

const tagsLoaded = (state, action) => {
  let tagsToDisplay = action.tags.filterNot(tag => tag == 'uncategorized');
  return state.set("tags", tagsToDisplay.unshift("Latest Work"))
}

const showAbout = (state) => {
  return state.set("showAbout", true)
}

const aboutLoaded = (state, action) => {
  return state.set("about", action.about)
}

const showLoader = (state, action) => {
  return state.set("showLoader", true)
}

const hideLoader = (state, action) => {
  return state.set("showLoader", false)
}

const imagesLoaded = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  let visibleImages = action.images.filterNot(image => image.get("hidden"))
  return state.set("showAbout", false)
    .set("currentTag", action.tag)
    .set("imagesByTag", imagesByTag.set(action.tag, visibleImages))
}

export default chainReducers(
  map("TAGS_LOADED").to(tagsLoaded),
  map("IMAGES_LOADED").to(imagesLoaded),
  map("SHOW_CONTENT_LOADER").to(showLoader),
  map("HIDE_CONTENT_LOADER").to(hideLoader),
  map("SHOW_ABOUT").to(showAbout),
  map("ABOUT_LOADED").to(aboutLoaded),
)

