
$(document).ready(function () {
	var createHWBtn = $('#createHWBtn');
	createHWBtn.click(function () {
		var fileName = $('#fileName').val();
		var fileText = $('#fileText').val();

		var url = "/api/values/CreateFile";
		var request = {
			filename: fileName,
			filetext: fileText
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileSuccessClb, createFileErrorClb);
	});

	var concatenateBtn = $('#concatenateBtn');
	concatenateBtn.click(function () {
		showSpinner1();
		var fileName = $('#fileNameConc').val();

		var url = "/api/values/Concatenate";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb, concatFileErrorClb);
	});

	var concatenateWithContnetsBtn = $('#concatenateWithContnetsBtn');
	concatenateWithContnetsBtn.click(function () {
		showSpinner2();
		var fileName = $('#fileNameWithContentsConc').val();

		var url = "/api/values/ConcatenateWithContents";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb, concatFileErrorClb);
	});

	var createNBBtn = $('#createNBBtn');
	createNBBtn.click(function () {
		showSpinner3();
		var fileName = $('#fileNameNB').val();

		var url = "/api/values/CreateFileWithNB";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileNBSuccessClb, createFileNBErrorClb);
	});
});

function concatFileSuccessClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	console.log(response);
	alert("Files Concatenated successfully");
}
function concatFileErrorClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	alert("Files Concatenated successfully");
}

function createFileSuccessClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	console.log(response);
	alert("File created successfully");
}
function createFileErrorClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	alert("File created successfully");
}

function createFileNBSuccessClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	console.log(response);
	alert("File created successfully");
}
function createFileNBErrorClb(response) {
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
	alert("File created successfully");
}

function CallWS(type, url, dataType, request, contentType, callback) {

	$.ajax({
		type: type,
		contentType: contentType,
		url: url,
		dataType: dataType,
		data: JSON.stringify(request),
		success: function (data) {
			hideSpinner1();
			hideSpinner2();
			hideSpinner3();
			console.log(data);
			if (callback) callback(data);
		},
		failure: function (data) {
			hideSpinner1();
			hideSpinner2();
			hideSpinner3();
			alert("File created successfully");
		},
		error: function (data) {
			hideSpinner1();
			hideSpinner2();
			hideSpinner3();
			alert("File created successfully");
		}

	});
}

function showSpinner1() {
	$('#ath-spinner-1').show();
}
function hideSpinner1() {
	$('#ath-spinner-1').hide();
}
function showSpinner2() {
	$('#ath-spinner-2').show();
}
function hideSpinner2() {
	$('#ath-spinner-2').hide();
}
function showSpinner3() {
	$('#ath-spinner-3').show();
}
function hideSpinner3() {
	$('#ath-spinner-3').hide();
}