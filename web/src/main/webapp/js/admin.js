function AdminUI(adminApi, imageApi, modal) {
    var self = this;

    var tagAdminUIs = [];
    var menu = new Menu();
    var modalFooter = modal.find('.modal-footer');
    var imageActions = modalFooter.find('#image-actions');

    var loader = div("loader");
    loader.text("Loading");

    var container = div("admin-container");
    var tagAdminUIsContainer = div("admin-tag-container");

    menu.addItem("reload tags", function() {
        loader.show();
        adminApi.reloadTags(function()  {
            notify("Reloaded.");
            loader.hide();
        });
    });

    menu.addItem("reload files", function() {
        loader.show();
        adminApi.reloadFiles(function() {
            notify("Reloaded.");
            loader.hide();
        });
    });

    var menuElem = menu.buildUI();
    container.append(menuElem);
    container.append(tagAdminUIsContainer);
    container.append(loader);

    this.buildUI = function() {
        return container;
    };

    this.load = function() {
        imageApi.loadAllTagsAnd(function(tags) {
            self.handleLoadTags(tags);
        });
    };

    this.handleLoadTags = function(tags) {
        tags.forEach(function(tag) {
            self.handleTag(tag);
        });
    };

    this.handleTag = function(tag) {
        var tagAdminUI = new TagAdminUI(adminApi, imageApi, tag);
        var sectionElem = tagAdminUI.buildUI();
        tagAdminUIsContainer.append(sectionElem);

        tagAdminUI.loadImages();
        tagAdminUIs.push(tagAdminUI);

        tagAdminUI.onImageSelected(function(image) {
            self.showImageAdminUI(image);
        });
    };

    this.showImageAdminUI = function(image) {
        // Todo: cache these, I suppose. Not that I'm sure it matters.
        var imageAdminUI = new ImageAdminUI(adminApi, image, modal);
        var element = imageAdminUI.buildUI();

        var modalBody = modal.find('.modal-body');
        modalBody.empty();
        imageActions.empty();
        modalBody.append(element);
    };
}

function Menu() {
    var self = this;

    var container = div('admin-menu-container');
    var menuItemContainer = div('admin-menu-item-container');

    container.append(menuItemContainer);

    var menuItems = [];

    this.buildUI = function() {
        return container;
    };

    this.getElement = function() {
        return container;
    };

    this.addItem = function(name, callback) {
        var itemDiv = div('admin-menu-item');
        itemDiv.text(name);
        menuItemContainer.append(itemDiv);

        var item = {
            name: name,
            callback: callback,
            elem: itemDiv
        };

        itemDiv.click(function() {
            callback(item);
        });

        menuItems.push(item);
        return item;
    };

    this.removeItem = function(item) {
        menuItems.remove(item);
        item.elem.remove();
    };
}

function TagAdminUI(adminApi, imageApi, tag) {
    var self = this;
    var onImageSelectedCallback = function() {};

    var container = div("tag-admin-container");

    var nameField = textInputElem("tag", tag, "tag-name-field propValue");

    var nameSpan = $('<span/>');
    nameSpan.append(nameField);

    var updateTagNameButton = button("rename");
    updateTagNameButton.addClass("update-tag-name-button");
    updateTagNameButton.click(function() {
        adminApi.renameTag(tag, nameField);
    });

    container.append(nameSpan);
    container.append(updateTagNameButton);

    var imageList = div("tag-admin-image-list");

    container.append(imageList);
    container.bind('drop', function(event) {
        var hi = event.data;
        console.log(hi);
    });
    container.bind('dragover', function(event) {
        event.preventDefault();
        return false;
    });

    this.buildUI = function() {
        return container;
    };

    this.getElement = function() {
        return container;
    };

    this.loadImages = function() {
        imageApi.loadImagesForTagAnd(tag, function(images) {
            self.handleImages(images);
        });
    };

    this.onImageSelected = function(callback) {
        onImageSelectedCallback = callback;
    };

    this.handleImages = function(images) {
        images.forEach(function(image) {
            var thumbnailUIElement = self.createThumbnailImage(image);
            imageList.append(thumbnailUIElement);
        });
    };

    this.createThumbnailImage = function(image) {
        var thumbnail = image.findImageFileByName("thumbnail");
        var thumbImageElem = img(thumbnail.src);
        thumbImageElem.attr("data-toggle", "modal");
        thumbImageElem.attr("data-target", "#image-modal");
        thumbImageElem.click(function() {
            self.selectImage(image);
        });
        var adminThumbLinkContainer = div("admin-thumb-link");
        adminThumbLinkContainer.append(thumbImageElem);
        return adminThumbLinkContainer;
    };

    this.selectImage = function(image) {
        onImageSelectedCallback(image);
    };
}

function ModalButton(title, action) {
    var button = $('<button type="button" class="btn btn-primary">' + title  + '</button>');
    button.click(action);
}

function ImageAdminUI(adminApi, image, modal) {
    var self = this;

    var container = div("image-admin-container image-admin-defaults");

    var infoContainer = $('<div/>');
    infoContainer.addClass("image-admin-info-contents");

    var imageContainer = $('<div/>');
    imageContainer.addClass("image-admin-image-contents");

    var imageElem = $('<img/>');
    imageContainer.append(imageElem);

    var imageName = span("admin-image-name");
    modal.find('.modal-title').text(image.name);

    var imageDate = span("admin-image-name");
    imageDate.text(image.dateText);

    var imageFileUploadContainer = div("admin-image-fileupload-container");
    var imageFileUploadProgress = div("admin-image-fileupload-progress");

    //<input id="fileupload" type="file" name="files[]" data-url="server/php/" multiple>
    var imageFileUploadField = $('<input/>');
    imageFileUploadField.attr("type", "file");
    imageFileUploadField.attr("name", "file");
    // Todo: hard-coded "original" rather than the image file we're replacing... oh well?
    imageFileUploadField.attr("data-url", adminApi.getPath() + "/image/" + image.name + "/original.png");
    imageFileUploadField.attr("multiple");
    imageFileUploadField.fileupload({
        method: 'PUT',
        dataType: 'json',
        done: function (e, data) {
            notify("Upload completed");
            imageFileUploadProgress.text("");
            imageFileUploadProgress.css({
                width: 0
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            imageFileUploadProgress.css({
                width: progress + '%'
            });
            imageFileUploadProgress.text(progress + "%");
        },
        dropZone: imageContainer
    });
    imageFileUploadContainer.append(imageFileUploadField);
    imageFileUploadContainer.append(imageFileUploadProgress);

    infoContainer.append(imageName);
    infoContainer.append(imageDate);
    infoContainer.append(imageFileUploadContainer);

    var propertiesEditor = new PropertiesEditor(adminApi, image);
    var propertiesEditorElem = propertiesEditor.buildUI();
    infoContainer.append(propertiesEditorElem);

    container.append(infoContainer);
    container.append(imageContainer);

    this.buildUI = function() {
        var original = image.findImageFileByName("original");
        if (! original) {
            original = image.findImageFileByName("scaled");
        }
        imageElem.attr("src", original.src);
        return container;
    };

    this.getElement = function() {
        return container;
    };

    this.toggleImageFiles = function() {
    };

    this.toggleProperties = function() {
        propertiesEditor.toggleVisibility();
    };

    this.disposeUI = function() {
    };
}

function PropertiesEditor(adminApi, image) {
    var self = this;

    var propertyFields = [];
    var hidden = false;

    var container = $('<div/>');
    container.addClass("properties-editor");

    var propertiesEditorContainer = $('<div/>');

    var addPropertyButton = button("add", "add-property-button");
    addPropertyButton.click(function() {
        self.addPropertyField();
    });

	var savePropertiesButton = button("save", "save-properties-button");
	savePropertiesButton.click(function() {
		self.saveProperties();
	});

    this.buildUI = function() {
        var properties = image.properties;
        if (properties) {
            for (var name in properties) {
                if (properties.hasOwnProperty(name)) {
                    if (name.length > 0) {
                        this.appendPropertyEditorField(name, properties[name]);
                    }
                }
            }
        }

        container.append(propertiesEditorContainer);
        container.append(addPropertyButton);
        container.append(savePropertiesButton);

        return container;
    };

    this.toggleVisibility = function() {
        if (hidden) {
            this.show();
        } else {
            this.hide();
        }
    };

    this.hide = function() {
        container.hide();
        hidden = true;
    };

    this.show = function() {
        container.show();
        hidden = false;
    };

    this.addPropertyField = function() {
        this.appendPropertyEditorField("", "");
    };

    this.appendPropertyEditorField = function(name, value) {
        var nameField = textInputElem("name", name, "property-editor-name-field");

        var valueField;
        if (value.length > 20) {
            valueField = textareaElem("value", value, "property-editor-value-textarea");
        } else {
            valueField = textInputElem("value", value, "property-editor-value-field");
        }
        valueField.addClass("propValue");

        propertyFields.push({
            nameField: nameField,
            valueField: valueField
        });

        var span = $("<span/>");
        span.addClass("property-editor-fields");
        span.append(nameField);
        span.append(valueField);

        propertiesEditorContainer.append(span);
    };

    this.saveProperties = function() {
        var newProperties = {};
        $.each(propertyFields, function(idx, propertyField) {
            var name = propertyField.nameField.val();
            newProperties[name] = propertyField.valueField.val();
        });

        adminApi.saveProperties(image, newProperties, function() {
            image.properties = newProperties;
        });
    }
}

$(document).ready(function() {

    var modal = $('#image-modal');

    var imageApi = new ImageApi(baseImageContentServicePath);
    var adminApi = new AdminApi(baseServicePath);
    var adminUI = new AdminUI(adminApi, imageApi, modal);

    $('body').append(adminUI.buildUI());

    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });

    adminUI.load();
});

