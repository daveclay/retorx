var tagInfo = {
    "figure constructions":
        "The figure constructions are explorations in engineering art, building up abstract " +
        "sculptural elements integrated into figures rendered with mixed media. <i>\"There's a lot of chaotic elements " +
        "in these pieces. I tried to construct a certain amount of decayed industrial textures and figurative energy.\"</i> " +
        "These figures represent a transition between the digital collage and the artist's current figurative oil paintings.",

    "figure painting":
        "The artist's current primary focus is painting the figure in oils. <i>\"I'm looking at using oils - " +
        "its variety in color and texture - to further explore the complex relationships of humanity, sexuality, and our digital-industrial " +
        "environment. The figures drift in and out of abstract, ambient textures rather than existing in a well defined " +
        "space.\"</i>",

    "abstracts":
        "<i>\"Abstraction is always at the edge of even my figurative works. I realized that I wasn't interested " +
        "in literal transcriptions or realism. I want to reflect a broader context of the environment that we live in." +
        "\"</i> The abstract pieces here represent experiments and studies, elements that may be brought into the figurative works.",

    "digital collage":
        "These digital works, created from 2001-2007, examine the ephemeral nature of modern sexuality and technology. " +
        "The source images are assembled into abstract bio-mechanical forms with explicit and suggestive figurative " +
        "elements. These images combined the artist's fascination with code, engineering and figurative work.",

    "posters": "These posters were created for various local bands using various pen and ink techniques and digitally colored.",

    "sculpture": "<i>\"Sculpture is rarely a focus of my work, but has had a major influence on how I approach drawing" +
        " and painting. It's a tool for me to delve further into industrial forms with new media.\"</i>",

    "graphic design": "Album covers and websites for various personal and professional projects."
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
        tagInfoElem.html(tagInfo[tag] || "");
        if (tag == "about") {
            imageGallery.showGallery(about.buildElement());
        } else {
            imageGallery.loadImagesForTag(tag);
        }
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
        tagInfoElem.html(tagInfo[initialTag]);
    }

    setTimeout(function() { window.scrollTo(0, 1); }, 2000);
});

