
function AboutInfo(baseServicePath, contentElem) {
    var self = this;
    var aboutElem = $('#about');

    this.load = function() {
        $.getJSON(baseServicePath + "about/info", function(response) {
            aboutElem.find("#about-text").html(response.data);
        });
    };

    this.show = function() {
        contentElem.empty();
        contentElem.append(aboutElem);
        aboutElem.show();
    };
}

