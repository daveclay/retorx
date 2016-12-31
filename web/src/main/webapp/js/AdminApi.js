function AdminApi(baseServicePath) {
    var self = this;

    function Ajax(baseUrl) {
        var self = this;

        this.get = function(params) {
            $.ajax({
                type: 'GET',
                url: baseUrl + params.url,
                success: params.success,
                error: function(request,status,error) {
                    if (params.error) {
                        params.error(request, status, error)
                    } else {
                        console.log("Request failed due to " + status + " " + error);
                    }
                }
            });
        };

        this.postFile = function(params) {
            // https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin
        };

        this.postJson = function(params) {
            $.ajax({
                type: 'POST',
                url: baseUrl + params.url,
                success: params.success,
                data: params.data,
                contentType: "text/json",
                error: function(request,status,error) {
                    if (params.error) {
                        params.error(request, status, error)
                    } else {
                        console.log("Request failed due to " + status + " " + error);
                    }
                }
            });
        }
    }

    var adminPath = baseServicePath + "admin";
    var ajax = new Ajax(adminPath);

    this.getPath = function() {
        return adminPath;
    };

    this.uploadImage = function(callback) {
        ajax.postJson({
            url: "/image",
            success: callback
        });
    };

    this.reloadTags = function(callback) {
        ajax.get({
            url: "/reloadTags",
            success: callback
        })
    };

    this.reloadFiles = function(callback) {
        ajax.get({
            url: "/reloadFromFiles",
            success: callback
        })
    };

    this.renameTag = function(existingTag, tagField) {
        ajax.postJson({
            url: "/rename/" + existingTag,
            data: tagField.val(),
            success: function() {
                notify("Saved.");
            }
        });
    };

    this.createTagImage = function(tag, callback) {
        ajax.postJson({
            url: "/tag/image/" + tag,
            success: callback
        });
    };

    this.saveProperties = function(image, properties, callback) {
        return ajax.postJson({
            url: "/" + image.name + "/properties",
            data: JSON.stringify(properties),
            success: function() {
                notify("saved " + image.name);
                callback(properties);
            }
        });
    };
}

