import { fromJS } from 'immutable'

import {
  reloadTags,
  reloadFiles,
  editSelected
} from "./actions/actions"

export default fromJS({
  tags: [],
  imagesByTag: {},
  menuItems: [
    {
      name: "reload tags",
      action: reloadTags
    },
    {
      name: "reload files",
      action: reloadFiles
    },
    {
      name: "Edit",
      action: editSelected
    },
  ],
  imageEditorProperties: [],
  multipleImageEditorProperties: [],
  loader: {
    show: false,
    message: ""
  }
})
