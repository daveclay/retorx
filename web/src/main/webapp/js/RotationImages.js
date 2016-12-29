function ThumbnailGallery(imageRotator) {
    var self = this;

    var container = div('thumbnails-container');

    imageRotator.onClose(function() {
        self.show();
    });

    this.getElement = function() {
        return container;
    };

    this.showImages = function(images) {
        images.forEach(function(image) {
            self.addImageData(image);
        });
    };

    this.show = function() {
        container.show();
    };

    this.addImageData = function(image) {
        var imageFile = image.findImageFileByName("thumbnail");
        var imgElem = img(imageFile.src, 'thumbnail');
        imgElem.click(function() {
            self.selectImage(image);
        });
        container.append(imgElem);
    };

    this.selectImage = function(image) {
        imageRotator.showImage(image);
        container.hide();
    };
}

$(document).ready(function () {

    var imageApi = new ImageApi(baseImageContentServicePath);
    var imageRotator = new ImageRotator();
    var thumbnailGallery = new ThumbnailGallery(imageRotator);

    var elem = imageRotator.getElement();
    $('body').append(elem);
    imageRotator.init();

    var hash = window.location.hash;
    if (hash.length > 0) {
        var id = hash.substring(1);
    } else {
        imageApi.loadLatestImagesAnd(function(images) {
            var elem = thumbnailGallery.getElement();
            $('body').append(elem);
            thumbnailGallery.showImages(images)
        });
    }

});

