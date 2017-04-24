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

export const buildShareURL = (shareButtonData) => {
  // {id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}&picture={{raw_image_url}}&description={{text}}'}

  console.log(shareButtonData);
  let currentImage = this.gallery.currItem;
  let imageData = currentImage.retorxData;
  let original = imageData.findImageFileByName("original");
  let pictureUrl = original.src;
  let description = imageData.name;
  let tag = imageData.tags[0];
  let id = imageData.id;
  let shareUrl = "http://daveclay.com/art/" + tag + "/" + id;

  // TODO: this is hard-coded to fb
  let shareData = {
    id: 'facebook',
    label: 'Share on Facebook',
    url: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '&picture=' + pictureUrl + '&description=' + description
  };

  return shareData;
}

