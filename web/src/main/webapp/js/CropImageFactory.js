var skater = {
    numberOfImages: 10,
    url: "/images/skater.jpg",
    imagesPerRow: 5,
    width: 1200,
    height: 714
};

var impact = {
    numberOfImages: 25,
    url: "/images/impact.jpeg",
    imagesPerRow: 5,
    width: 257,
    height: 196
};
// var imageFactory = new CropImageFactory(skater);

function CropImageFactory(imageConfig) {
    var self = this;

    var imageElems = [];

    var imagesPerRow = imageConfig.imagesPerRow;
    var imageWidth = imageConfig.width / imagesPerRow;
    var imageHeight = imageConfig.height / (imageConfig.numberOfImages / imagesPerRow);

    this.init = function() {
        for (var i = 0; i < imageConfig.numberOfImages; i++) {
            this.addImageData(i, imageConfig.url);
        }
    };

    this.addImageData = function(idx, imageUrl) {
        var row = Math.floor(idx / imagesPerRow);
        var col = idx % imagesPerRow;
        var left = imageWidth * col * -1;
        var top = row * imageHeight * -1;

        var imgElem = img(imageUrl, 'rotation-image rotation-image-' + idx);
        imgElem.on("mousedown", function(event) {
            event.preventDefault();
        });
        imgElem.css({
            position: "relative",
            left: left,
            top: top
        });

        var imageContainer = div('rotation-image-container');
        imageContainer.css({
            width: imageWidth,
            height: imageHeight,
            overflowX: "hidden",
            overflowY: "hidden"
        });

        imageContainer.append(imgElem);

        this.addImageElement(imageContainer);
    };

    this.addImageElement = function(element) {
        imageElems.push(element);
    };

    this.getImageElements = function() {
        return imageElems;
    };
}

