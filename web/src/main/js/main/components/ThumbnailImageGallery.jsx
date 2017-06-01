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

  getShareButtonURL(shareButtonData) {
    /*
     Object {id: "twitter", label: "Tweet", url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"}id: "twitter"label: "Tweet"url: "https://twitter.com/intent/tweet?text={{text}}&url={{url}}"__proto__: Object
     */
    /*
     Object {id: "pinterest", label: "Pin it", url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"}id: "pinterest"label: "Pin it"url: "http://www.pinterest.com/pin/create/button/?url={{url}}&media={{image_url}}&description={{text}}"__proto__: Object
     */
    /*
     Object {id: "download", label: "Download image", url: "{{raw_image_url}}", download: true}download: trueid: "download"label: "Download image"url: "{{raw_image_url}}"__proto__: Object
     */
    // {
    // id:'facebook',
    // label:'Share on Facebook',
    // url:'https://www.facebook.com/sharer/sharer.php?u={{url}}&picture={{raw_image_url}}&description={{text}}'}

    console.log(shareButtonData);
    let original = this.currentImage.get("imageFilesByVersion").get("original")
    let pictureUrl = "http://daveclay.com/" + src(this.currentImage, "original")
    let description = this.currentImage.get("name")
    let tag = this.currentImage.get("tags").get(0)
    let shareUrl = "http://daveclay.com/" + tag + "/" + description

    /*
     https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fdaveclay.com%2Fart%2Ffigure%20painting%2Ftransmission%26picture%3Dservices%2Fimages%2Fimage%2Foriginal%2Ftransmission.png%26description%3Dtransmission
     */

    // TODO: this is hard-coded to fb
    let shareData = {
      id: 'facebook',
      label: 'Share on Facebook',
      url: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '&picture=' + pictureUrl + '&description=' + description
    };

    console.log(shareData.url)

    return shareData;
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

  let buildShareURL = (shareButtonData) => {
    return shareButtonHandler.getShareButtonURL(shareButtonData)
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