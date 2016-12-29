
function AboutInfo(baseServicePath) {
    this.data = "";

    this.load = function() {
        var me = this;
        $.getJSON(baseServicePath + "about/info", function(data) {
            me.data = data.data;
        });
    };

    this.buildElement = function () {
        var element = $('<div/>');
        element.addClass("rsContent");

        var imageLink = $('<a/>');
        imageLink.addClass("rsImg");
        imageLink.attr("href", "/images/me.jpg");

        var caption = $('<div/>');
        caption.addClass("about rsCaption");
        caption.html(this.data);

        var title = $('<span/>');
        title.addClass("main title-color");
        title.html("About the artist");
        caption.prepend(title);

        element.append(imageLink);
        element.append(caption);

        var elementArray = [];
        elementArray.push(element);
        return elementArray;
    };
}

