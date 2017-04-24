import React from 'react'

import {
  Row,
} from "react-bootstrap"

import {
  PhotoSwipeGallery
} from 'react-photoswipe';

import {
  getThumbBoundsFn
} from "../lib/photoswipe"

import {
  src,
  dateText,
  buildShareURL,
  buildSelectedIndexOptions
} from "../../lib/imageData"

const renderCaption = (image) => {
  let properties = image.get("properties")
  let name = image.get("properties").get("name") || image.get("name")

  return `
    <span>
      <span className="imageName">${name}</span>
      <span>/</span>
      <span className="imageDate">${dateText(image)}</span>
      ${
        properties.has("info") ?
          `<span>
            <span>/</span>
            <span className="imageInfo">${properties.get("info")}</span>
          </span>`
          :
          ""
      }
    </span>
    `
}

const ThumbnailImageGallery = ({
  tag,
  images
}) => {

  if (!tag) {
    return <span/>
  }

  let options = {
    galleryPIDs: true,
    galleryUID: tag,
    showHideOpacity: true,
    getThumbBoundsFn: getThumbBoundsFn,
    getImageURLForShare: buildShareURL
  };

  let getThumbnailContent = (imageGalleryItem) => {
    return (
      <img src={imageGalleryItem.thumbnail} />
    );
  }

  let items = images.map(image => {
    let scaledImageFile = image.get("imageFilesByVersion").get("scaled")
    return {
      src: src(image, "scaled"),
      thumbnail: src(image, "thumbnail"),
      w: scaledImageFile.get("width"),
      h: scaledImageFile.get("height"),
      title: renderCaption(image),
      pid: image.id
    }
  })

  return (
    <div id="gallery" className="col-xs-12 col-sm-9 col-md-10">
      <PhotoSwipeGallery items={items.toJS()}
                         options={options}
                         thumbnailContent={getThumbnailContent}/>
    </div>
  )
}

export default ThumbnailImageGallery