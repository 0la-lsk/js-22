"use strict";

var numChecked = void 0,
    numAnswers = void 0;
initTest();

function getUserAnswers(event) {
	//event.preventDefault();
	return CheckAll(testPattern.testText);
};

function ShowModal(event) {
	event.preventDefault();
	$('body').append('<div class="modal-box"><div class="modal-message"><span id="span-result">x</span><p id="ResultText"></p></div></div>');
	$('p#ResultText').html(getUserAnswers());
};

function HideModal() {
	$('.modal-box').hide();
	$('div.modal-box').remove();
	$("input:checkbox").removeProp("checked");
}

$('#test-submit').on('click', ShowModal);

$(document).on('click', 'span#span-result', HideModal);
$(document).on('click', '.modal-box', HideModal);
