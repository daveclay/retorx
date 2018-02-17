import React from 'react'

import {
  PhotoSwipeGallery
} from 'react-photoswipe';

import Loader from "../containers/Loader"

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
      <div class="artwork-title">
        ${name}
      </div>
      <span class="imageDate">${dateText(image)}</span>
      ${
        properties.has("info") ?
          `<span>
            <span>/</span>
            <span class="imageInfo">${properties.get("info")}</span>
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
    // return "http://daveclay.com/" + src(this.currentImage, "original")
    return src(this.currentImage, "original")
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

  componentDidMount() {
    window.addEventListener("hashchange", this.onHashChange, false);
 }

  onHashChange() {
    if (window.location.hash.length < 1 && this.props) {
      window.location.hash = `&gid=${this.props.tag}`;
    }
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

  imageLoaded(e) {
    e.target.className = "fadeIn"
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
      let image = imageGalleryItem.image;
      let properties = image.get("properties");
      let name = properties.get("name") || image.get("name");
      let info = properties.get("info") || "";
      return (
        <div className="image-container">
          <img key={imageGalleryItem.thumbnail}
               src={imageGalleryItem.thumbnail}
               className="transparent"
               width={imageGalleryItem.thumbnailWidth}
               height={imageGalleryItem.thumbnailHeight}
               onLoad={this.imageLoaded} />
          <div className="artwork-title">
            {name}
          </div>
          <span className="caption">{(info ? " " + info : "")}</span>
        </div>
        )
    }

    let items = this.props.images.map(image => {
      let thumbnailImageFile = image.get("imageFilesByVersion").get("thumbnail")
      let scaledImageFile = image.get("imageFilesByVersion").get("scaled")
      return {
        src: src(image, "scaled"),
        thumbnail: src(image, "thumbnail"),
        image: image,
        thumbnailWidth: thumbnailImageFile.get("width"),
        thumbnailHeight: thumbnailImageFile.get("height"),
        w: scaledImageFile.get("width"),
        h: scaledImageFile.get("height"),
        title: renderCaption(image),
        pid: image.get("name"),
      }
    })

    let reactTagInfo = {
      __html: this.props.tagInfo
    }

    let onChange = (photoSwipe) => {
      // Note: this clears out the gid hash when it's set by clicking on a gallery.
      if (window.location.hash.indexOf("pid") < 0) {
        window.location.hash = "";
      }
      this.shareButtonHandler.setCurrentImage(photoSwipe.getCurrentIndex())
      this.opened = true
    }

    let tagInfoElement = this.props.tagInfo ? <div id="tag-text" dangerouslySetInnerHTML={reactTagInfo}/> : null

    return (
      <div id="gallery" className="main-content col-xs-12 col-sm-9 col-md-10">
        {
          tagInfoElement
        }
        <PhotoSwipeGallery key={this.props.tag}
                           ref={(photoswipeGallery) => this.photoswipeGallery = photoswipeGallery}
                           items={items.toJS()}
                           options={this.buildOptions()}
                           beforeChange={onChange}
                           thumbnailContent={getThumbnailContent}/>
        <Loader />
      </div>
    )
  }
}

export default ThumbnailImageGallery
