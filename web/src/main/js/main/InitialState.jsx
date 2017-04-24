import { fromJS } from 'immutable'

import {
  loadImagesForTag,
  loadAllTags,
} from "./actions/imageApiActions"

export default fromJS({
  initialTag: "figure painting",
  tags: [],
  imagesByTag: {},
  loader: {
    show: false,
    message: ""
  }
})
