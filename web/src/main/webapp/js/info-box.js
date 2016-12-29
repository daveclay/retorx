function InfoBox(name) {
	var divId = '#' + name + 'InfoBox';
	this.siteInfoBox = $(divId);
	this.showInfoBoxLink = $('#show' + name + 'Link');
	this.hideInfoBoxLink = $('#hide' + name + 'Link');
}

var currentInfoBox;
var newCurrentInfoBox;

InfoBox.prototype.show = function() {
	newCurrentInfoBox = this;
	if (currentInfoBox != null) {
		currentInfoBox.hide(true);
	} else {
		this.showAfterHide();
	}
}

InfoBox.prototype.showAfterHide = function() {
	currentInfoBox = this;
	animateInfoBox(this.siteInfoBox, { top: 50 });
	animateInfoBox(siteInfoBoxBackgroundDiv, { top: 50 });
	animateInfoBox(siteControlsBackgroundDiv, { top: 300, opacity: 1 });
	this.showInfoBoxLink.addClass("hidden");
	this.hideInfoBoxLink.removeClass("hidden");
};

InfoBox.prototype.hide = function(showInfoBox) {
	animateInfoBox(this.siteInfoBox, { top: -250 });
	animateInfoBox(siteInfoBoxBackgroundDiv, { top: -250 });
	animateInfoBox(siteControlsBackgroundDiv, { top: 50, opacity: .2 });
	this.showInfoBoxLink.removeClass("hidden");
	this.hideInfoBoxLink.addClass("hidden");
};

function animateInfoBox(infoBoxDiv, styleToAnimate, callbackInfoBox) {
	if (callbackInfoBox) {
		infoBoxDiv.animate(styleToAnimate, 500, showNewCurrentInfoBox);
	} else {
		infoBoxDiv.animate(styleToAnimate, 500);
	}
}

function showNewCurrentInfoBox() {
	newCurrentInfoBox.showAfterHide();
}

var notifyMe = false;

function toggleNotifyMe() {
	if (notifyMe) {
		$('#notifyMeLink').text("notify me of events and updates");
	} else {
		$('#notifyMeLink').text("you will be notified of events and updates");
	}

	notifyMe = !notifyMe;
}

function clearDefaultEmail() {
	if (emailField.val() == "email@domain.com") {
		setupInputFieldForUserInput(emailField);
	}
}

function clearDefaultMessage() {
	if (messageField.val() == "your message") {
		setupInputFieldForUserInput(messageField);
	}
}

function setupInputFieldForUserInput(field) {
	field.val("");
	field.removeClass("defaultGray");
	field.addClass("black");
}

function submitContactForm() {
	var email = emailField.val();
	var mailingList = "false";
	if ($('#mailingListField:checked').val()) {
		mailingList = "true";
	}
	var message = messageField.val();
	$.post(baseContactFormServicePath + "add",
	{
		email: email,
		mailingList: mailingList,
		message: message
	}
			);

	messageField.val("");
	submitContactFormButton.val("sent!");
	submitContactFormButton.attr("disabled", "true");

	setTimeout("hideContactFormAfterSend()", 1000);
	setTimeout("resetContactFormFields()", 1500);
}

function hideContactFormAfterSend() {
	contactFormInfoBox.hide();
}

function resetContactFormFields() {
	messageField.val("your message");
	submitContactFormButton.val("send");
	submitContactFormButton.removeAttr("disabled");
}
