function ImageGallery(imageApi, loader, thumbnailsElem) {
    var self = this;
    var containerElem = $('#photoswipe');

    this.getElement = function() {
        return containerElem;
    };

    this.loadImagesForTag = function (tag) {
        imageApi.loadImagesForTagAnd(tag, function (images) {
            this.handleLoadImages(tag, images);
        }.bind(this));
    };

    this.loadLatestImages = function () {
        imageApi.loadLatestImagesAnd(function (images) {
            var image = images[0];
            console.log(image);
            this.handleLoadImages(tag, images);
        }.bind(this));
    };

    this.setCurrentTag = function (tag) {
        this.currentTag = tag;
    };

    this.clear = function() {
        thumbnailsElem.empty();
    };

    this.showGallery = function(items, index) {
        if (items == null) {
            items = this.imageObjects;
        }

        var options = {
            galleryPIDs: true
        };

        if (index) {
            options.index = index;
            options.showHideOpacity = true;
            options.getThumbBoundsFn = function(index) {
                // find thumbnail element
                var thumbnail = document.querySelectorAll('#content img')[index];
                // get window scroll Y
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                // optionally get horizontal scroll
                // get position of element relative to viewport
                var rect = thumbnail.getBoundingClientRect();
                // w = width
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
                // Good guide on how to get element coordinates:
                // http://javascript.info/tutorial/coordinates
            }
        }

        var gallery = new PhotoSwipe(
            containerElem[0],
            PhotoSwipeUI_Default,
            items,
            options
        );

        gallery.init();
    };

    this.handleLoadImages = function (tag, images) {
        if (images.length == 0) {
            log("No images present.");
            return;
        }
        var image = images.peek();
        var tagObject = image.tags.peek();
        this.setCurrentTag(tagObject);

        this.imageArray = [];
        this.imageObjects = [];

        var createThumbnail = function(imageData) {
            var thumbnailElem = $('<img/>');
            var file = imageData.findImageFileByName("thumbnail");
            thumbnailElem.attr("src", file.src);
            thumbnailElem.attr("width", file.width);
            thumbnailElem.attr("height", file.height);
            thumbnailElem.addClass("transparent");
            thumbnailElem.one("load", function() {
                loader.hide();
                thumbnailElem.addClass("fadeIn");
                thumbnailElem.removeClass("transparent");
            });
            thumbnailElem.click(function() {
                self.showGallery(null, imageData.index);
            });

            return thumbnailElem;
        };

        var createImageFromData = function(imageData) {
            self.addImageData(imageData);
            var imageObject = self.createImageObject(imageData);
            self.imageObjects.push(imageObject);
            var thumbnailElem = createThumbnail(imageData);
            imageData.thumbnailElem = thumbnailElem;
            thumbnailsElem.append(thumbnailElem);
        };

        images.forEach(function (imageData) {
            if ( ! imageData.hidden) {
                createImageFromData(imageData);
            }
        });
    };

    this.addImageData = function (image) {
        if (this.imageArray.length > 0) {
            image.previous = this.imageArray.peek();
            image.index = this.imageArray.length;
            image.previous.next = image;
        }
        this.imageArray.push(image);
    };

    this.createImageObject = function (image) {
        var scaled = image.findImageFileByName("scaled");
        return {
            src: scaled.src,
            msrc: image.findImageFileByName("thumbnail").src,
            w: scaled.width,
            h: scaled.height,
            title: this.createImageCaptionElement(image).html(),
            pid: image.id
        };
    };

    this.findImageById = function (id) {
        return this.images.find(function (image) {
            return image.id == id;
        });
    };

    this.createImageCaptionElement = function (image) {
        var caption = $('<span/>');
        var nameElement = $('<span/>');
        nameElement.addClass("imageName");
        nameElement.text(image.properties["name"] || image.name);
        caption.append(nameElement);

        caption.append($("<span> / </span>"));

        var dateElement = $('<span/>');
        dateElement.addClass("imageDate");
        dateElement.text(image.dateText);
        caption.append(dateElement);
        var properties = image.properties;
        if (properties) {
            if (properties["info"]) {
                var infoElement = $('<span/>');
                infoElement.text(properties["info"]);
                caption.append($("<span> / </span>"));
                caption.append(infoElement);
            }
        }

        return caption;
    };
}
