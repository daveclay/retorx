import { fromJS } from 'immutable'

import { menuItems } from "./lib/menuItems"

export default fromJS({
  tags: [],
  currentTag: "paintings",
  imagesByTag: {},
  menuItems: menuItems,
  imageEditorProperties: [],
  multipleImageEditorProperties: [],
  loader: {
    show: false,
    message: ""
  }
})
