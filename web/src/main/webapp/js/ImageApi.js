var baseServicePath = "services/";
var baseImageContentServicePath = baseServicePath + "images/";

function ImageApi(baseImageContentServicePath) {
    var self = this;

    this.get = function(url, callback) {
        return $.getJSON(baseImageContentServicePath + url)
            .success(callback);
    };

    this.loadAllTagsAnd = function(callback) {
        this.get("tags", function(tags) { callback(tags) });
    };

    this.loadImagesForTagAnd = function(tag, callback) {
        return this.get("tag/" + tag).success(function(images) {
            images.forEach(function(image) {
                self.calculateImageProperties(image);
            });
            callback(images);
        });
    };

    this.loadLatestImagesAnd = function(callback) {
        this.get("latest", function(images) {
            images.forEach(function(image) {
                self.calculateImageProperties(image);
            });
            callback(images)
        });
    };

    this.loadImageContent = function(id, callback) {
        this.get("data/" + id, function(image) {
            self.calculateImageProperties(image);
            callback(image);
        });
    };

    this.calculateImageProperties = function(image) {
        image.findImageFileByName = function(imageFileName) {
            return this.imageFiles.find(function(imageFile) {
                return imageFile.name == imageFileName;
            });
        };

        var imageFiles = image.imageFiles;
        imageFiles.forEach(function(imageFile) {
            imageFile.src = baseImageContentServicePath + "image/" + imageFile.name + "/" + image.name + ".png";
        });

        var milliseconds = image.date;
        var date = new Date(milliseconds);
        image.dateText = date.format("mmm yyyy");
    };

}

