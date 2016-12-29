/*
    splits the provided hash string between key/value pairs
 */
function KeyValueStringParser(value) {
	if (value) {
		value = value.substring(1, value.length);
	}
	this.hash = value;
	this.pairs = {};
	this.parse();
}

KeyValueStringParser.prototype.parse = function() {
	if (this.hash.indexOf("/") > -1) {
		var parser = this;
		this.hash.split("/").forEach(function(keyValueString) {
			parser.parseKeyValue(keyValueString);
		});
	} else {
		this.parseKeyValue(this.hash);
	}
};

KeyValueStringParser.prototype.parseKeyValue = function(keyValueString) {
	var idx = keyValueString.indexOf(":");
	if (keyValueString && idx > -1) {
		var key = keyValueString.substring(0, idx);
		var value = keyValueString.substring(idx +  1, keyValueString.length);
		this.pairs[key] = value;
	}
};

KeyValueStringParser.prototype.get = function(key) {
	return this.pairs[key];
};

