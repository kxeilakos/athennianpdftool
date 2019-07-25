//Constants

// Local: "https://localhost:44340/"
// Azure: ""

var baseUrl = "https://localhost:44340/files/";
var baseUrlUpload = "https://localhost:44340/";

var targetModes = {
	Blank: "_blank",
	Parent: "_parent"
};

$(document).ready(function () {

	$('#browseFileBtn').click(function () {
		$(this).parent().find('input[type=file]').click();
	});
	$('#inputFileTxt').change(function () {
		$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());
	});

	$('#uploadFileBtn').click(function () {
		showSpinner1();
		var fileName = GetFileName();

		// Add a delay to ensure that file reader will have read file before posting it
		var ready = false;
		var result = '';
		var check = function () {
			if (ready === true) {
				uploadFile(fileName, result);
				return;
			}
			setTimeout(check, 700);
		};

		check();

		var fileReader = new FileReader();
		fileReader.onloadend = function (evt) {
			// file is loaded
			result = evt.target.result;

			ready = true;
		};
		fileReader.readAsDataURL(fileName);

	});

	var createHWBtn = $('#createHWBtn');
	createHWBtn.click(function () {
		showSpinner0();
		$('#createResponseMsg').text("");
		var fileName = $('#fileName').val();
		var fileText = $('#fileText').val();

		var url = "/api/values/CreateFile";
		var request = {
			filename: fileName,
			filetext: fileText
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileSuccessClb);
	});

	var concatenateBtn = $('#concatenateBtn');
	concatenateBtn.click(function () {
		showSpinner1();
		var fileName = $('#fileNameConc').val();

		var url = "/api/values/Concatenate";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb);
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

// HELPERS
function GetFileName() {
	return $('#inputFileTxt')[0].files[0];
}

function uploadFile(fileName, base64CodedImg) {
	var ready = false;
	var check = function () {
		if (ready === true) {
			var type = 'POST';
			var contentType = 'application/json';
			var url =  '/api/values/UploadFile';
			var data = {
				filename: fileName.name,
				filecontent: base64CodedImg
			};
			var dataType = '';
			CallWS("POST", url, "json", data, "application/json;charset=utf-8", concatFileSuccessClb);
			return;
		}
		setTimeout(check, 700);
	};
	check();
	var fileReader = new FileReader();
	fileReader.onloadend = function (evt) {
		result = evt.target.result;
		ready = true;
	};
	fileReader.readAsDataURL(fileName);
}

// CALLBACKS
function createFileSuccessClb(response) {
	hideSpinners();

	$('#createResponseMsg').text(response.message);
	var url = baseUrl + response.fileName;
	window.open(url, targetModes.Blank);
}

function concatFileSuccessClb(response) {
	hideSpinners();
	$('#uploadResponseMsg').text(response.Message);
}

function createFileNBSuccessClb(response) {
	hideSpinners();
	console.log(response);
	alert("File created successfully");
}

function concatFileErrorClb(response) {
	hideSpinners();
	alert("Error!");
}

function createFileErrorClb(response) {
	hideSpinners();
	alert("File created successfully");
}

function createFileNBErrorClb(response) {
	hideSpinners();
	alert("File created successfully");
}

// CALLWS
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

// SHOW / HIDE ELEMENTS
function showSpinner0() {
	$('#ath-spinner-0').show();
}
function hideSpinner0() {
	$('#ath-spinner-0').hide();
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
function hideSpinners() {
	hideSpinner0();	
	hideSpinner1();
	hideSpinner2();
	hideSpinner3();
}