function makeModalButton(elem) {
    elem.attr("data-toggle", "modal");
    elem.attr("data-target", "#image-modal");
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
            callback(item, itemDiv);
        });

        menuItems.push(item);
        return item;
    };

    this.removeItem = function(item) {
        menuItems.remove(item);
        item.elem.remove();
    };
}

function PropertiesApi(image, adminApi) {

    this.foreachProperty = function(callback) {
        var properties = image.properties;
        if (properties) {
            for (var name in properties) {
                if (properties.hasOwnProperty(name)) {
                    if (name.length > 0) {
                        callback(name, properties[name]);
                    }
                }
            }
        }
    };

    this.getProperties = function() {
        return image.properties;
    };

    this.saveProperties = function(newProperties) {
        return adminApi.saveProperties(image, newProperties, function() {
            image.properties = newProperties;
        });
    }
}

function AdminUI(adminApi, imageApi, modal) {
    var self = this;

    var tagAdminUIs = [];
    var selectionEnabled = false;

    var menu = new Menu();
    var modalFooter = modal.find('.modal-footer');
    var imageActions = modalFooter.find('#image-actions');

    var loader = $("#loader");

    var container = div("admin-container");
    var tagAdminUIsContainer = div("admin-tag-container");

    menu.addItem("reload tags", function() {
        loader.show();
        adminApi.reloadTags(function()  {
            notify("Reloaded.");
        });
    });

    menu.addItem("reload files", function() {
        loader.show();
        adminApi.reloadFiles(function() {
            notify("Reloaded.");
        });
    });

    menu.addItem("enable select", function(menuItem, menuDiv) {
        if (selectionEnabled) {
            menuDiv.text("enable select");
            self.disableSelection();
        } else {
            menuDiv.text("disbale select");
            self.enableSelection();
        }
    });

    menu.addItem("hide selected", function() {
        loader.show();
        tagAdminUIs.forEach(function(tagAdminUI) {
            tagAdminUI.markSelectedAsHidden();
        });
    });

    makeModalButton(menu.addItem("edit selected", function() {
        self.editSelected();
    }).elem);

    var menuElem = menu.buildUI();
    container.append(menuElem);
    container.append(tagAdminUIsContainer);

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

    this.editSelected = function() {
        var modalBody = modal.find('.modal-body');
        modalBody.empty();

        var nameField = textInputElem("name", "", "property-editor-name-field");
        var valueField = textInputElem("value", "", "property-editor-value-field");
        valueField.addClass("propValue");

        modalBody.append(nameField);
        modalBody.append(valueField);

        var saveButton = $('<button type="button" class="btn btn-primary">Save</button>');
        saveButton.click(function() {
            tagAdminUIs.forEach(function(tagAdminUI) {
                tagAdminUI.saveSelectedImagesProperties();
            });
        });
        modal.find("#modal-actions").empty();
        modal.find("#modal-actions").append(saveButton);
    };

    this.handleTag = function(tag) {
        var tagAdminUI = new TagAdminUI(adminApi, imageApi, tag, modal);
        var sectionElem = tagAdminUI.buildUI();
        tagAdminUIsContainer.append(sectionElem);

        tagAdminUI.loadImages();
        tagAdminUIs.push(tagAdminUI);

        tagAdminUI.onImageSelected(function(image) {
            self.showImageAdminUI(image);
        });
    };

    this.enableSelection = function() {
        tagAdminUIs.forEach(function(tagAdminUI) {
            tagAdminUI.enableSelection();
        });
        selectionEnabled = true;
    };

    this.disableSelection = function() {
        tagAdminUIs.forEach(function(tagAdminUI) {
            tagAdminUI.disableSelection();
        });
        selectionEnabled = false;
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

function TagAdminUI(adminApi, imageApi, tag, modal) {
    var self = this;
    var imagesById = {};

    var selectedImagesById = {};

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
            imagesById[image.id] = image;
        });
    };

    this.createThumbnailImage = function(image) {
        var thumbnail = image.findImageFileByName("thumbnail");
        var thumbImageElem = img(thumbnail.src, "transparent");
        if (image.properties["hidden"]) {
            thumbImageElem.addClass("hidden-image");
        }
        thumbImageElem.one("load", function() {
            thumbImageElem.addClass("fadeIn");
            thumbImageElem.removeClass("transparent");
        });
        thumbImageElem.attr("data-imageId", image.id);
        makeModalButton(thumbImageElem);
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

    this.getImageById = function(imageId) {
        return imagesById[imageId];
    };

    this.disableSelection = function() {
        $(container).selectable("destroy");
    };

    this.enableSelection = function() {
        $(container).selectable({
            filter: 'img',
            selected: function(event, ui) {
                var imageId = $(ui.selected).attr("data-imageid");
                var selectedImage = self.getImageById(imageId);
                if (selectedImage) {
                    selectedImagesById[imageId] = selectedImage;
                } else {
                    console.warn("Unknown image id ", imageId);
                }
            },
            unselected: function( event, ui ) {
                var imageId = $(ui.unselected).attr("data-imageid");
                var selectedImage = self.getImageById(imageId);
                if (selectedImage) {
                    delete selectedImagesById[imageId];
                } else {
                    console.warn("Unknown image id ", imageId);
                }
            },
            stop: function(event, ui) {
                console.log(selectedImagesById);
            }
        });
    };

    this.markSelectedAsHidden = function() {
        $("#loader").show();
        return Object.values(selectedImagesById).map(function(image) {
            var propertiesApi = new PropertiesApi(image, adminApi);
            var properties = propertiesApi.getProperties();
            properties['hidden'] = true;
            return propertiesApi.saveProperties(properties);
        });
    };

    this.saveSelectedImagesProperties = function() {
        $("#loader").show();
        var modalBody = modal.find('.modal-body');
        var name = modalBody.find("input[name='name']").val();
        var value = modalBody.find("input[name='value']").val();
        return Object.values(selectedImagesById).map(function(image) {
            var propertiesApi = new PropertiesApi(image, adminApi);
            var properties = propertiesApi.getProperties();
            properties[name] = value;
            return propertiesApi.saveProperties(properties);
        });
    }
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
        $("#loader").show();
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

    $(document).ajaxStop(function () {
        $('#loader').fadeOut(300);
    });

    $('#content').append(adminUI.buildUI());

    adminUI.load();
});
