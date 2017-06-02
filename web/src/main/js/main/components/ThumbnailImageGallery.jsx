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
  setImages(images) {
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

class ThumbnailImageGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialImage: this.props.initialImage,
    }
    this.shareButtonHandler = new ShareButtonHandler()
  }

  componentWillUpdate(nextProps) {
    this.shareButtonHandler.setImages(nextProps.images)
  }

  componentDidUpdate() {
    if (this.props.images) {
      if (this.state.initialImage) {
        this.photoswipeGallery.setState({
          isOpen: true,
          options: this.buildOptions()
        })
        this.setState({
          initialImage: null,
        })
      } else if (this.opened) {
        this.photoswipeGallery.setState({
          options: this.buildOptions()
        })
      }
    }
  }

  buildOptions() {
    let options = {
      galleryPIDs: true,
      galleryUID: this.props.tag,
      showHideOpacity: true,
      getThumbBoundsFn: getThumbBoundsFn,
      getImageURLForShare: (shareButtonData) => {
        return this.shareButtonHandler.getImageURLForShare(shareButtonData)
      },
      getPageURLForShare: (shareButtonData) => {
        return this.shareButtonHandler.getPageURLForShare(shareButtonData)
      },
      getTextForShare: (shareButtonData) => {
        return this.shareButtonHandler.getTextForShare(shareButtonData)
      },
    };

    let index = this.findInitialImageIndex()
    if (index) {
      options.index = index
    }

    return options
  }

  findInitialImageIndex() {
    if (this.state.initialImage && this.props.images) {
      return this.props.images.findIndex(image => image.get("name") == this.state.initialImage)
    }
  }

  render() {
    if (!this.props.tag) {
      return <span/>
    }

    let getThumbnailContent = (imageGalleryItem) => {
      return (
        <img src={imageGalleryItem.thumbnail}/>
      );
    }

    let items = this.props.images.map(image => {
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
      __html: this.props.tagInfo
    }

    let onChange = (photoSwipe) => {
      this.shareButtonHandler.setCurrentImage(photoSwipe.getCurrentIndex())
      this.opened = true
    }

    let tagInfoElement = this.props.tagInfo ? <div id="tag-text" dangerouslySetInnerHTML={reactTagInfo}/> : null

    return (
      <div id="gallery" className="col-xs-12 col-sm-9 col-md-10">
        {
          tagInfoElement
        }
        <PhotoSwipeGallery ref={(photoswipeGallery) => this.photoswipeGallery = photoswipeGallery}
                           items={items.toJS()}
                           options={this.buildOptions()}
                           beforeChange={onChange}
                           thumbnailContent={getThumbnailContent}/>
      </div>
    )
  }
}

export default ThumbnailImageGallery
