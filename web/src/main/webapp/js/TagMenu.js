function TagMenu(imageApi, parentElement) {
    var self = this;

    this.container = $('<div/>');
    this.menuListElem = $('<ul/>');

    this.container.append(this.menuListElem);
    parentElement.append(this.container);

    this.tagMenuItems = [];
    this.onTagSelectedEventHandler = function() { };

    this.onTagSelected = function (eventHandler) {
        this.onTagSelectedEventHandler = eventHandler;
    };

    this.handleLoadAllTags = function (tags) {
        tags.forEach(function (tag) {
            self.addTag(tag, function () {
                self.onTagSelectedEventHandler(tag);
            });
        });

        this.addTag("about", function () {
            self.onTagSelectedEventHandler("about");
        });
    };

    this.indicateSelectedTag = function(tag) {
        var selectedTagMenuItem = this.tagMenuItems.find(function(tagMenuItem) {
            return tagMenuItem.name == tag
        });
        selectedTagMenuItem.active();
    };

    this.addTag = function (tag, callback) {
        var tagMenuItem = new TagMenuItem(tag, this, callback);
        if (this.tagMenuItems.length > 0) {
            tagMenuItem.previous = this.tagMenuItems.peek();
            tagMenuItem.previous.next = tagMenuItem;
        }
        this.tagMenuItems.push(tagMenuItem);
        this.menuListElem.append(tagMenuItem.getElement());
    };
}

function TagMenuItem(name, menu, callback) {
    var self = this;
	this.name = name;
	this.menuItemElem = $("<li/>");
	this.linkUI = $("<a/>");
	this.linkUI.addClass("tagLink main");
	this.linkUI.attr("id", "tag" + this.name);

	this.linkUI.click(function () {
        self.active();
		callback(this);
	});

    var linkText = $('<span/>');
    linkText.addClass("tag-link-text");
    linkText.html(name.toUpperCase());

    this.tagImage = $('<img/>');
    this.tagImage.addClass("tagImage");
    this.tagImage.attr("width", "100");
    this.tagImage.attr("height", "100");

    this.linkUI.append(linkText);
    this.linkUI.append(this.tagImage);
	this.menuItemElem.append(this.linkUI);

    this.active = function () {
        this.menuItemElem.addClass("active-menu-item");
        var linkedListHelper = new LinkedListHelper(this);
        linkedListHelper.forEach(function (tag) {
            if (tag != self) {
                tag.inactive();
            }
        });
    };

    this.inactive = function () {
        this.menuItemElem.removeClass("active-menu-item");
    };

    this.getElement = function() {
        return this.menuItemElem;
    }
}


