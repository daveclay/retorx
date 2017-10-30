import { fromJS } from 'immutable'

import {
  loadImagesForTag,
  loadTags,
} from "./actions/imageApiActions"

import {
  parseRequest
} from "./lib/hash"

const linkedImageData = parseRequest()

export default fromJS({
  initialTag: (linkedImageData && linkedImageData.tag) || "figure painting",
  initialImage: (linkedImageData && linkedImageData.imageId) || null,
  tags: [],
  imagesByTag: {},
  showLoader: true,
  showAbout: false,
  tagInfo: {
  }
})
