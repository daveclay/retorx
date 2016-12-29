function setupHashChangeHandler() {
    $(window).hashchange(function(event) {
        if (ignoreNextHashEvent) {
            return;
        }

        var hash = window.location.hash;
        hashLinkMap = new KeyValueStringParser(window.location.hash);
        if (hashLinkMap.get("image")) {
            setTimeout("showHashLinkedImage()",100);
        } else {
            if (isGalleryVisible()) {
                hideGallery();
            }
            var tag = hashLinkMap.get("tag");
            if (tag && currentTag != tag) {
                loadImagesForTag(tag);
            }
        }
    });
}


