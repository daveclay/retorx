function ImageEditor(imageApi) {
    var self = this;
    var canvas = new Canvas();
    var selectionMask = new SelectionMask();
    var keyDownHandlers = [];
    var keyUpHandlers = [];
    var image;

    var container = div("image-editor-container");
    var imageContainer = div("image-editor-image-container");
    var toolsContainer = div("image-editor-tools-container");

    imageContainer.append(canvas.buildUI());
    imageContainer.append(selectionMask.getUIElement());

    container.append(imageContainer);
    container.append(toolsContainer);

    $(window).bind("keydown", function(event) {
        keyDownHandlers.forEach(function(keyHandler) {
            keyHandler(event);
        })
    });

    $(window).bind("keyup", function(event) {
        keyUpHandlers.forEach(function(keyHandler) {
            keyHandler(event);
        })
    });

    $(window).bind("mousedown", function(event) {
        return self.mouseDownHandler(event);
    });

    $(window).bind("mouseup", function(event) {
        return self.mouseUpHandler(event);
    });

    $(window).bind("mousemove", function(event) {
        return self.mouseMoveHandler(event);
    });

    this.editImage = function(_image) {
        image = _image;
        selectionMask.init(this);
        canvas.setImage(image);
        selectionMask.setSize({w: image.imageFile.width, h: image.imageFile.height});
    };

    this.getImage = function() {
        return image;
    };

    this.buildUI = function() {
        this.buildTools();
        return container;
    };

    this.buildTools = function() {
        var selectionTool = new SelectionTool(this);
        var thumbnailTool = new CropTool();
        toolsContainer.append(selectionTool.buildUI());
        toolsContainer.append(thumbnailTool.buildUI());
    };

    this.mouseDownHandler = function(event) {
    };

    this.mouseUpHandler = function(event) {
    };

    this.mouseMoveHandler = function(event) {
    };

    this.registerKeyUpHandler = function(keyhandler) {
        keyUpHandlers.push(keyhandler);
    };

    this.registerKeyDownHandler = function(keyhandler) {
        keyDownHandlers.push(keyhandler);
    };

    this.startListeningForSelection = function() {
        this.mouseDownHandler = function(event) {
            var x = Math.floor(event.pageX);
            var y = Math.floor(event.pageY);
            selectionMask.selectionMouseDown(x, y);
            self.startListeningForSelectionResize();

            return false;
        };
        this.mouseUpHandler = function(event) {
            var x = Math.floor(event.pageX);
            var y = Math.floor(event.pageY);
            selectionMask.stopMask(x, y);
            self.mouseMoveHandler = function(event) {};
            return false;
        };
    };

    this.startListeningForSelectionResize = function() {
        this.mouseMoveHandler = function(event) {
            var x = Math.floor(event.pageX);
            var y = Math.floor(event.pageY);
            selectionMask.selectionMouseMove(x, y);
            return false;
        };
    };

    this.stopListeningForSelection = function() {
        this.mouseDownHandler = function(event) {};
    };

    this.getSelection = function() {
        return selectionMask;
    }
}

function SelectionMask() {

    var maskContainer = div();

    var movableDivCollection = new MovableDivCollection();
    var topMask = movableDivCollection.addMovableDiv("selection-mask-div top-mask-div");
    var leftMask = movableDivCollection.addMovableDiv("selection-mask-div left-mask-div");
    var rightMask = movableDivCollection.addMovableDiv("selection-mask-div right-mask-div");
    var bottomMask = movableDivCollection.addMovableDiv("selection-mask-div bottom-mask-div");

    maskContainer.append(topMask.getElement());
    maskContainer.append(leftMask.getElement());
    maskContainer.append(rightMask.getElement());
    maskContainer.append(bottomMask.getElement());
    maskContainer.hide();

    var imageSize = {w: 0, h: 0};
    var selectionSize = {w: 0, h: 0};
    var initialPosition = { x: 0, y: 0 };
    var currentPosition = {x: 0, y: 0};
    var constrainSquare = false;
    var movingMask = false;
    var movingMaskOffsetVector = { x: 0, y: 0 };

    topMask.moveTo({ x: 0, y: 0});
    bottomMask.moveTo({ x: 0, y: 0});

    this.init = function(imageEditor) {
        imageEditor.registerKeyDownHandler(function(event) {
            constrainSquare = event.keyCode == 16;
            imageEditor.registerKeyUpHandler(function(event) {
                if (event.keyCode == 16) {
                    constrainSquare = false;
                }
            })
        });
    };

    this.getUIElement = function() {
        return maskContainer;
    };

    this.getSelectionRect = function() {
        return {
            x: currentPosition.x,
            y: currentPosition.y,
            w: selectionSize.w,
            h: selectionSize.h
        };
    };

    this.setSize = function(_size) {
        imageSize = _size;
        topMask.resizeTo({ w: imageSize.w });
        bottomMask.resizeTo({ w: imageSize.w });
    };

    this.cancel = function() {
        maskContainer.hide();
        initialPosition = { x: 0, y: 0};
        currentPosition = {x: 0, y: 0 };
        selectionSize = { w: 0, h: 0 };
        topMask.moveTo({ x: 0, y: 0});
        bottomMask.moveTo({ x: 0, y: 0});
        movingMask = false;
    };

    this.selectionMouseDown = function(x, y) {
        if (this.isWithinCurrentSelection(x, y)) {
            movingMaskOffsetVector = { x: x - currentPosition.x, y: y - currentPosition.y };
            movingMask = true;
        } else {
            movingMask = false;
            this.startMask({ x: x, y: y });
        }
    };

    this.selectionMouseMove = function(x, y) {
        if (movingMask) {
            this.moveMaskTo({ x: x - movingMaskOffsetVector.x, y: y - movingMaskOffsetVector.y });
        } else {
            this.updateMaskSize({ x: x, y: y });
        }
    };

    this.isWithinCurrentSelection = function(x, y) {
        return x > currentPosition.x && x <= currentPosition.x + selectionSize.w &&
            y > currentPosition.y && y <= currentPosition.y + selectionSize.h
    };

    this.startMask = function(newPosition) {
        initialPosition = { x: newPosition.x, y: newPosition.y };
    };

    this.moveMaskTo = function(newPosition) {
        currentPosition = { x: newPosition.x, y: newPosition.y };
        this.drawMask();
    };

    this.updateMaskSize = function(mousePosition) {
        currentPosition.y = Math.min(mousePosition.y, initialPosition.y);
        currentPosition.x = Math.min(mousePosition.x, initialPosition.x);
        selectionSize.h = Math.max(mousePosition.y - initialPosition.y, initialPosition.y - mousePosition.y);
        selectionSize.w = Math.max(mousePosition.x, initialPosition.x) - currentPosition.x;

        this.drawMask();
    };

    this.drawMask = function() {
        maskContainer.show();
        if (constrainSquare) {
            selectionSize.h = selectionSize.w;
        }

        topMask.resizeTo({
            h: currentPosition.y
        });

        leftMask.moveTo({
            y: currentPosition.y
        });

        leftMask.resizeTo({
            w: currentPosition.x,
            h: selectionSize.h
        });

        rightMask.moveTo({
            x: currentPosition.x + selectionSize.w,
            y: topMask.getSize().h
        });

        rightMask.resizeTo({
            w: imageSize.w - rightMask.getPosition().x,
            h: selectionSize.h
        });

        bottomMask.moveTo({
            x: 0,
            y: topMask.getSize().h + rightMask.getSize().h
        });
        bottomMask.resizeTo({
            h: imageSize.h - topMask.getSize().h + leftMask.getSize().h
        });

        // debug(bottomMask.getPosition().y + " == " + topMask.getSize().h + " + " + leftMask.getSize().h);
        movableDivCollection.update();
    };


    this.stopMask = function(x, y) {
        if (initialPosition.x == x && initialPosition.y == y) {
            this.cancel();
        }
    };
}

function MovableDivCollection() {

    var movableDivs = [];

    this.addMovableDiv = function(cssClass) {
        var movableDiv = new MovableDiv(cssClass, false);
        movableDivs.push(movableDiv);

        return movableDiv;
    };

    this.update = function() {
        movableDivs.forEach(function(movableDiv) {
            movableDiv.update();
        });
    };
}

function MovableDiv(cssClass, autoUpdate) {
    var self = this;
    var elem = div(cssClass);
    var position = { x: 0, y: 0 };
    var size = { w: 0, h: 0 };

    var onResizeCallbacks = [];
    var onMoveCallbacks = [];

    this.getElement = function() {
        return elem;
    };

    this.getCSSPosition = function() {
        var css = elem.position();
        return { x: css.left, y: css.top };
    };

    this.getPosition = function() {
        return position;
    };

    this.getSize = function() {
        return size;
    };

    this.moveTo = function(newPosition) {
        position.x = newPosition.x;
        position.y = newPosition.y;
        if (autoUpdate) this.update();
        onMoveCallbacks.forEach(function(callback) {
            callback(position);
        });
    };

    this.resizeTo = function(newSize) {
        size.w = newSize.w || size.w;
        size.h = newSize.h || size.h;
        if (autoUpdate) this.update();
        onResizeCallbacks.forEach(function(callback) {
            callback(size);
        });
    };

    this.moveBy = function(vector) {
        position.x = position.x + vector.x;
        position.y = position.y + vector.y;
        this.moveTo(position.x, position.y);
    };

    this.update = function() {
        elem.css({
            top: position.y,
            left: position.x,
            width: size.w,
            height: size.h
        });

        var top = elem.position().top;
        if (Math.round(top) != top) {
            elem.css({
                top: Math.round(top)
            });
        }
    };

    this.onResize = function(callback) {
        onResizeCallbacks.push(callback);
    };

    this.onMove = function(callback) {
        onMoveCallbacks.push(callback);
    };
}

function Tool(name, imageEditor) {
    var self = this;
    var selected = false;
    var container = div("tool-container");
    var onSelectHandler = function() { };
    var onDeselectHandler = function() { };
    container.text(name);
    container.click(function() {
        self.toggleSelected();
        return false;
    });

    this.onSelect = function(callback) {
        onSelectHandler = callback;
    };

    this.onDeselect = function(callback) {
        onDeselectHandler = callback;
    };

    this.buildUI = function() {
        return container;
    };

    this.toggleSelected = function() {
        if (selected) {
            this.deselect();
        } else {
            this.select();
        }
    };

    this.deselect = function() {
        container.removeClass("tool-container-selected");
        selected = false;
        onDeselectHandler();
    };

    this.select = function() {
        container.addClass("tool-container-selected");
        selected = true;
        onSelectHandler();
    };
}

function SelectionTool(imageEditor) {
    var self = $.extend(this, new Tool("Select", imageEditor));

    this.onSelect(function() {
        imageEditor.startListeningForSelection();
    });

    this.onDeselect(function() {
        imageEditor.stopListeningForSelection();
    });
}

function CropTool(imageEditor) {
    var self = $.extend(this, new Tool("Crop"));

    this.onSelect(function() {
        var selection = imageEditor.getSelection();
        var rectangle = selection.getSelectionRect();
        var image = imageEditor.getImage();

    });

    this.onDeselect(function() {
    });
}

function CropDialog() {
    var container = div("crop-dialog-container");
}

function Canvas() {
    var self = this;

    var container = div();
    var canvas = $('<canvas></canvas>');
    container.append(canvas);

    var imageObj = new Image();

    this.buildUI = function() {
        return container;
    };

    this.setImage = function(image) {
        canvas.attr("width", image.imageFile.width);
        canvas.attr("height", image.imageFile.height);
        var context = canvas[0].getContext("2d");
        imageObj.onload = function() {
            context.drawImage(imageObj, 0, 0);
        };
        imageObj.src = image.imageFile.imageSrc;
    };

    this.filter = function() {
        imageData = context.getImageData(0, 0, crop.width, crop.height);
        filter.call(this, imageData);
        context.putImageData(imageData, 0, 0);
    }
}

function RandomTagImage(imageApi, adminApi) {
    adminApi.createTagImage("figure painting", function(image) {
        var tagImg = $('<img/>');
        tagImg.attr("src", image.imageFile.tagSrc);
        body.append(tagImg);
        body.append(image.name)
    });
}

var debugDiv = div();

function debug(msg) {
    debugDiv.text(msg);
}

$(document).ready(function() {
    var imageApi = new ImageApi(baseImageContentServicePath);
    var adminApi = new AdminApi(baseServicePath);
    var imageEditor = new ImageEditor(imageApi);
    var body = $('body');

    var imgUrl = "http://localhost:8081/services/imageContent/image/man%20standing/image";
    imageApi.loadImageContent("man standing", function(image) {
        imageEditor.editImage(image);
        body.append(imageEditor.buildUI());

        body.append(debugDiv);
        debugDiv.css({
            position: "absolute",
            top: 70,
            left: 10
        });
    });


    /*
    var imageCrop = new ImageEditor(imgUrl, body);
    imageCrop.buildUI();
    */
});


