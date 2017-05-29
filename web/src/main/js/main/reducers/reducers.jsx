import Immutable from "immutable"

import { chainReducers, map } from '../../lib/chainReducers'

const tagsLoaded = (state, action) => {
  return state.set("tags", action.tags.filterNot(tag => tag == 'uncategorized'))
}

const tagSelected = (state, action) => {
  return state.set("showAbout", false)
}

const showAbout = (state) => {
  return state.set("showAbout", true)
}

const showLoader = (state, action) => {
  return state.set("loader", Immutable.Map({
    show: action.show,
    message: action.message
  }))
}

const imagesLoaded = (state, action) => {
  let imagesByTag = state.get("imagesByTag")
  return state.set("showAbout", false)
    .set("currentTag", action.tag)
    .set("imagesByTag", imagesByTag.set(action.tag, action.images))
}

export default chainReducers(
  map("TAGS_LOADED").to(tagsLoaded),
  map("IMAGES_LOADED").to(imagesLoaded),
  map("SHOW_LOADER").to(showLoader),
  map("SHOW_ABOUT").to(showAbout),
)

