class ImageGallery {
  constructor(containerElement, thumbnailsElem) {
    this.containerElem = containerElement
    this.thumbnailsElem = thumbnailsElem
    this.imageArray = []
    this.imageObjects = []
  }

  openGallery(tag, items, index) {
    this.tag = tag
    let options = this.buildPhotoswipeOptions(tag, index)
    this.gallery = new PhotoSwipe(
      this.containerElem,
      PhotoSwipeUI_Default,
      items,
      options
    );

    this.gallery.init();
  }

  imagesLoaded(images) {
    images.forEach(imageData => {
      if ( ! imageData.hidden) {
        this.createImageFromData(imageData);
      }
    })
  }

  createImageFromData(imageData) {
    this.addImageData(imageData);
    let imageObject = this.createImageObject(imageData);
    this.imageObjects.push(imageObject);
    let thumbnailElem = this.createThumbnail(imageData);
    imageData.thumbnailElem = thumbnailElem;
    this.thumbnailsElem.append(thumbnailElem);
  }

  createImageObject(image) {
    let scaled = image.findImageFileByName("scaled");
    return {
      src: scaled.src,
      msrc: image.findImageFileByName("thumbnail").src,
      w: scaled.width,
      h: scaled.height,
      title: this.createImageCaptionElement(image).html(),
      retorxData: image,
      pid: image.id
    }
  }

  createImageCaptionElement(image) {
    let caption = $('<span/>');
    let nameElement = $('<span/>');
    nameElement.addClass("imageName");
    nameElement.text(image.properties["name"] || image.name);
    caption.append(nameElement);

    caption.append($("<span> / </span>"));

    let dateElement = $('<span/>');
    dateElement.addClass("imageDate");
    dateElement.text(image.dateText);
    caption.append(dateElement);

    let properties = image.properties;
    if (properties) {
      if (properties["info"]) {
        let infoElement = $('<span/>');
        infoElement.text(properties["info"]);
        caption.append($("<span> / </span>"));
        caption.append(infoElement);
      }
    }

    return caption;
  };

  createThumbnail(tag, imageData) {
    let thumbnailElem = $('<img/>');
    let file = imageData.findImageFileByName("thumbnail");
    thumbnailElem.attr("src", file.src);
    thumbnailElem.attr("width", file.width);
    thumbnailElem.attr("height", file.height);
    thumbnailElem.addClass("transparent");
    thumbnailElem.one("load", () => {
      this.loader.hide();
      thumbnailElem.addClass("fadeIn");
      thumbnailElem.removeClass("transparent");
    });
    thumbnailElem.click(() => {
      this.showGallery(tag, null, imageData.index);
    });

    return thumbnailElem;
  }

  buildPhotoswipeOptions(tag, index) {
    let options = {
      galleryPIDs: true,
      galleryUID: tag
    };

    if (index) {
      this.buildSelectedIndexOptions(index, options)
    }

    return options
  }

  buildSelectedIndexOptions(index, options) {
    options.index = index
    options.showHideOpacity = true
    options.getThumbBoundsFn = (index) => this.getThumbBounds(index)
    options.getImageURLForShare = shareButtonData => this.buildShareURL(shareButtonData)
    return options
  }

  static getThumbBounds(index) {
    // find thumbnail element
    let thumbnail = document.querySelectorAll('#content img')[index];
    // get window scroll Y
    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
    // optionally get horizontal scroll
    // get position of element relative to viewport
    let rect = thumbnail.getBoundingClientRect();
    // w = width

    // Good guide on how to get element coordinates:
    // http://javascript.info/tutorial/coordinates
    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
  }

  buildShareURL(shareButtonData) {
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
}

export default ImageGallery
