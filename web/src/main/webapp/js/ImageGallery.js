function ImageGallery(imageApi, loader, tagInfoElem, thumbnailsElem) {
    var tagInfo = {
        "figure constructions":
        "The figure constructions are explorations in engineering art, building up abstract " +
        "sculptural elements integrated into figures rendered with mixed media. <i>\"There's a lot of chaotic elements " +
        "in these pieces. I tried to construct a certain amount of decayed industrial textures and figurative energy.\"</i> " +
        "These figures represent a transition between the digital collage and the artist's current figurative oil paintings.",

        "figure painting":
        "The artist's current primary focus is painting the figure in oils. <i>\"I'm looking at using oils - " +
        "its variety in color and texture - to further explore the complex relationships of humanity, sexuality, and our digital-industrial " +
        "environment. The figures drift in and out of abstract, ambient textures rather than existing in a well defined " +
        "space.\"</i>",

        "abstracts":
        "<i>\"Abstraction is always at the edge of even my figurative works. I realized that I wasn't interested " +
        "in literal transcriptions or realism. I want to reflect a broader context of the environment that we live in." +
        "\"</i> The abstract pieces here represent experiments and studies, elements that may be brought into the figurative works.",

        "digital collage":
        "These digital works, created from 2001-2007, examine the ephemeral nature of modern sexuality and technology. " +
        "The source images are assembled into abstract bio-mechanical forms with explicit and suggestive figurative " +
        "elements. These images combined the artist's fascination with code, engineering and figurative work.",

        "posters": "These posters were created for various local bands using various pen and ink techniques and digitally colored.",

        "sculpture": "<i>\"Sculpture is rarely a focus of my work, but has had a major influence on how I approach drawing" +
        " and painting. It's a tool for me to delve further into industrial forms with new media.\"</i>",

        "graphic design": "Album covers and websites for various personal and professional projects."
    };

    var self = this;
    var containerElem = $('#photoswipe');
    var gallery;

    this.getElement = function() {
        return containerElem;
    };

    this.loadImagesForTag = function (tag) {
        thumbnailsElem.empty();
        tagInfoElem.html(tagInfo[tag] || "");
        return imageApi.loadImagesForTagAnd(tag, function (images) {
            this.handleLoadImages(tag, images);
        }.bind(this));
    };

    this.clear = function() {
        thumbnailsElem.empty();
    };

    this.showGallery = function(tag, items, index) {
        if (items == null) {
            items = this.imageObjects;
        }

        var options = {
            galleryPIDs: true,
            galleryUID: tag
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
            },
            // {id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}&picture={{raw_image_url}}&description={{text}}'}
            options.getImageURLForShare = function(shareButtonData) {
                console.log(shareButtonData);
                var currentImage = gallery.currItem;
                var imageData = currentImage.retorxData;
                var original = imageData.findImageFileByName("original");
                var pictureUrl = original.src;
                var description = imageData.name;
                var tag = imageData.tags[0];
                var id = imageData.id;
                var shareUrl = "http://daveclay.com/art/" + tag + "/" + id;

                // TODO: this is hard-coded to fb
                var shareData = {
                    id: 'facebook',
                    label: 'Share on Facebook',
                    url: 'https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '&picture=' + pictureUrl + '&description=' + description
                };

                return shareData;
            }

        }

        gallery = new PhotoSwipe(
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

        this.imageArray = [];
        this.imageObjects = [];

        window.location.hash = "&gid=" + tag;

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
                self.showGallery(tag, null, imageData.index);
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
            retorxData: image,
            pid: image.id
        };
    };

    this.findImageById = function (id) {
        return this.imageArray.find(function (image) {
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
