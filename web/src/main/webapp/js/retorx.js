var tagInfo = {
    "figure constructions": "",
    "figure painting": "",
    "figure in oils": "",
    "abstract": "",
    "digital collage": "Digital pieces put together from photoshop hi.",
    "posters": "",
    "sculpture": ""
};

var initialTag = "figure painting";

$(document).ready(function() {
    var body = $('body');
    var tagInfoElem = $('#tag-text');

    var sidebarMenuElem = $('#sidebar-menu');
    var navbarMenuElem = $('#navbar-menu');
    var loader = $('#loader');

    var imageApi = new ImageApi(baseImageContentServicePath);
    var sidebarTagMenu = new TagMenu(imageApi, sidebarMenuElem);
    var navbarTagMenu = new TagMenu(imageApi, navbarMenuElem);

    var navbarButtonText = $('#navbar-menu-button-text');
    navbarButtonText.html(initialTag);

    sidebarTagMenu.load();
    navbarTagMenu.load();

    var imageGallery = new ImageGallery(imageApi, loader);
    body.append(imageGallery.getElement());

    var about = new AboutInfo(baseServicePath);
    about.load();

    var tagSelected = function(tag) {
        navbarButtonText.html(tag);
        loader.show();
        imageGallery.clear();
        if (tag == "about") {
            imageGallery.showGallery(about.buildElement());
        } else {
            imageGallery.loadImagesForTag(tag);
        }
        tagInfoElem.html(tagInfo[tag]);
    };

    sidebarTagMenu.onTagSelected(tagSelected);
    navbarTagMenu.onTagSelected(tagSelected);

    var hash = window.location.hash;
    if (hash.indexOf("-") > -1) {
        var values = hash.substring(1).split("-");
        var tag = values[0];
        imageGallery.loadImagesForTag(tag);
    } else {
        imageGallery.loadImagesForTag(initialTag);
    }

    setTimeout(function() { window.scrollTo(0, 1); }, 2000);
});

