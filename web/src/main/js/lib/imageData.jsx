import moment from "moment"

import { baseImageContentServicePathBuilder } from "./paths"

export const src = (image, imageFileName) => {
  return baseImageContentServicePathBuilder(`image/${imageFileName}/${image.get("name")}.png`)
};

export const dateText = (image) => {
  let milliseconds = image.get("date")
  let date = moment(milliseconds);
  return date.format("MMM YYYY");
}
