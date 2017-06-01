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

class ShareButtonHandler {
  constructor(images) {
    this.images = images
  }

  setCurrentImage(index) {
    this.currentImage = this.images.get(index)
  }

  getImageURLForShare( shareButtonData ) {
    let original = this.currentImage.get("imageFilesByVersion").get("original")
    return "http://daveclay.com/" + src(this.currentImage, "original")
  }

  getPageURLForShare( shareButtonData ) {
    let name = this.currentImage.get("name")
    let tag = this.currentImage.get("tags").get(0)
    return `http://daveclay.com/art/${tag}/${name}`
  }

  getTextForShare( shareButtonData ) {
    let customName = this.currentImage.get("customName");
    let info = this.currentImage.get("info");
    return `${customName} by artist Dave Clay. ${info}`
  }
}

const ThumbnailImageGallery = ({
  tag,
  tagInfo,
  images
}) => {

  let shareButtonHandler = new ShareButtonHandler(images)

  if (!tag) {
    return <span/>
  }

  let options = {
    galleryPIDs: true,
    galleryUID: tag,
    showHideOpacity: true,
    getThumbBoundsFn: getThumbBoundsFn,
    getImageURLForShare: function( shareButtonData ) {
      return shareButtonHandler.getImageURLForShare(shareButtonData)
    },
    getPageURLForShare: function( shareButtonData ) {
      return shareButtonHandler.getPageURLForShare(shareButtonData)
    },
    getTextForShare: function( shareButtonData ) {
      return shareButtonHandler.getTextForShare(shareButtonData)
    },

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
      pid: image.get("name")
    }
  })

  let reactTagInfo = {
    __html: tagInfo
  }

  let onChange = (photoSwipe) => {
    shareButtonHandler.setCurrentImage(photoSwipe.getCurrentIndex())
  }

  let tagInfoElement = tagInfo ? <div id="tag-text" dangerouslySetInnerHTML={reactTagInfo}/> : null

  return (
    <div id="gallery" className="col-xs-12 col-sm-9 col-md-10">
      {
        tagInfoElement
      }
      <PhotoSwipeGallery items={items.toJS()}
                         options={options}
                         beforeChange={onChange}
                         thumbnailContent={getThumbnailContent}/>
    </div>
  )
}

export default ThumbnailImageGallery