var initialTag = "figure painting";

var parseHash = function() {
    var hash = window.location.hash;
    var hashObj = hash.split("&").slice(1);
    if (hashObj) {
        var data = {};
        var gidParam = hashObj[0];
        if (gidParam && gidParam.indexOf("=") > -1 ) {
            data.tag = gidParam.split("=")[1];
        }
        var pidParam = hashObj[1];
        if (pidParam && pidParam.indexOf("=") > -1) {
            data.imageId = pidParam.split("=")[1];
        }

        return data;
    }
};

$(document).ready(function() {
    var body = $('body');
    var contentElem = $('#content');
    var tagInfoElem = $('#tag-text');

    var sidebarMenuElem = $('#sidebar-menu');
    var navbarMenuElem = $('#navbar-menu');
    var loader = $('#loader');

    var imageApi = new ImageApi(baseImageContentServicePath);
    var sidebarTagMenu = new TagMenu(imageApi, sidebarMenuElem);
    var navbarTagMenu = new TagMenu(imageApi, navbarMenuElem);

    var navbarButtonText = $('#navbar-menu-button-text');
    navbarButtonText.html(initialTag);

    var linkData = parseHash();

    var imageGallery = new ImageGallery(imageApi, loader, tagInfoElem, contentElem);
    body.append(imageGallery.getElement());

    var about = new AboutInfo(baseServicePath, contentElem);
    about.load();

    imageApi.loadAllTagsAnd(function(tags) {
        sidebarTagMenu.handleLoadAllTags(tags);
        navbarTagMenu.handleLoadAllTags(tags);
        if (linkData && linkData.tag) {
            sidebarTagMenu.indicateSelectedTag(linkData.tag);
            navbarButtonText.html(linkData.tag);
        }
    });

    var tagSelected = function(tag) {
        navbarButtonText.html(tag);
        loader.show();
        if (tag == "about") {
            loader.hide();
            imageGallery.clear();
            about.show();
        } else {
            imageGallery.loadImagesForTag(tag);
        }
    };

    sidebarTagMenu.onTagSelected(tagSelected);
    navbarTagMenu.onTagSelected(tagSelected);

    if (linkData && linkData.tag) {
        imageGallery.loadImagesForTag(linkData.tag).success(function() {
            if (linkData.imageId) {
                var image = imageGallery.findImageById(linkData.imageId);
                imageGallery.showGallery(linkData.tag, null, image.index);
            }
        })
    } else {
        imageGallery.loadImagesForTag(initialTag);
    }

    setTimeout(function() { window.scrollTo(0, 1); }, 2000);
});

