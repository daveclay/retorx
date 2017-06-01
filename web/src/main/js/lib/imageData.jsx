import moment from "moment"

import { baseImageContentServicePath } from "../main/constants/constants"

export const src = (image, imageFileName) => {
  return `${baseImageContentServicePath}image/${imageFileName}/${image.get("name")}.png`
};

export const dateText = (image) => {
  let milliseconds = image.get("date")
  let date = moment(milliseconds);
  return date.format("MMM YYYY");
}

export const buildSelectedIndexOptions = (index, options) => {
  options.index = index
  options.showHideOpacity = true
  options.getThumbBoundsFn = (index) => this.getThumbBounds(index)
  options.getImageURLForShare = shareButtonData => buildShareURL(shareButtonData)
  return options
}
