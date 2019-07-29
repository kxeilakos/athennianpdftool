// SHOW / HIDE ELEMENTS
function showSpinner0() {
	$('#ath-spinner-0').show();
}
function hideSpinner0() {
	$('#ath-spinner-0').hide();
}
function showSpinner0actv() {
	$('#ath-spinner-0-actv').show();
}
function hideSpinner0actv() {
	$('#ath-spinner-0-actv').hide();
}
function showSpinner1() {
	$('#ath-spinner-1').show();
}
function hideSpinner1() {
	$('#ath-spinner-1').hide();
}
function showSpinner1actv() {
	$('#ath-spinner-1-actv').show();
}
function hideSpinner1actv() {
	$('#ath-spinner-1-actv').hide();
}
function showSpinner2() {
	$('#ath-spinner-2').show();
}
function hideSpinner2() {
	$('#ath-spinner-2').hide();
}
function showSpinner2actv() {
	$('#ath-spinner-2-actv').show();
}
function hideSpinner2actv() {
	$('#ath-spinner-2-actv').hide();
}
function showSpinner3() {
	$('#ath-spinner-3').show();
}
function hideSpinner3() {
	$('#ath-spinner-3').hide();
}
function showSpinner3actv() {
	$('#ath-spinner-3-actv').show();
}
function hideSpinner3actv() {
	$('#ath-spinner-3-actv').hide();
}
function showSpinner4() {
	$('#ath-spinner-4').show();
}
function hideSpinner4() {
	$('#ath-spinner-4').hide();
}
function showSpinner4actv() {
	$('#ath-spinner-4-actv').show();
}
function hideSpinner4actv() {
	$('#ath-spinner-4-actv').hide();
}

function hideAsposeSpinners() {
	hideSpinner0();
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	hideSpinner4();
}

function hideActiveSpinners() {
	hideSpinner0actv();
	hideSpinner1actv();
	hideSpinner2actv();
	hideSpinner3actv();
	hideSpinner4actv();
}

function showAsposePdfArea() {
	$('#asposePdf-area').show();
	$('#activePdf-area').hide();
}
function showActivePdfArea() {
	$('#activePdf-area').show();
	$('#asposePdf-area').hide();
}
function setCreateBKResponseMessage(message) {
	$('#createBKResponseMsg').text(message);
}

// SET Messages
function setCreateResponseMessage(message) {
	$('#createResponseMsg').text(message);
}
function setUploadResponseMessage(message) {
	$('#uploadResponseMsg').text(message);
}
function setConcatResponseMessage(message) {
	$('#concatenateResponseMsg').text(message);
}
function setCreateNBResponseMessage(message) {
	$('#createNBResponseMsg').text(message);
}
function GetFileName() {
	return $('#inputFileTxt')[0].files[0];
}

function setCreateResponseMessageActv(message) {
	$('#createResponseMsg-actv').text(message);
}
function setUploadResponseMessageActv(message) {
	$('#uploadResponseMsg-actv').text(message);
}
function setConcatResponseMessageActv(message) {
	$('#concatenateResponseMsg-actv').text(message);
}
function setCreateNBResponseMessageActv(message) {
	$('#createNBResponseMsg-actv').text(message);
}
function GetFileNameActv() {
	return $('#inputFileTxt-actv')[0].files[0];
}