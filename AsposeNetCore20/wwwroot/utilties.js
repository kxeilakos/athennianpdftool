//Constants

// Local: "https://localhost:44340/"   & 
// Azure: "https://athennianasposepdftool.azurewebsites.net/"

var baseUrl = "https://localhost:44340/";
var baseUrlUpload = "https://localhost:44340/";

//var baseUrl = "https://athennianasposepdftool.azurewebsites.net/";
//var baseUrlUpload = "https://athennianasposepdftool.azurewebsites.net/";

var targetModes = {
	Blank: "_blank",
	Parent: "_parent"
};

$(document).ready(function () {

	// EVENTS
	$('#browseFileBtn').click(function () {
		$(this).parent().find('input[type=file]').click();
	});
	$('#inputFileTxt').change(function () {
		$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());
	});

	$('#uploadFileBtn').click(function () {
		var fileName = GetFileName();
		if (fileName === undefined) {
			setUploadResponseMessage("Please Select a file");
			return;
		}
		setUploadResponseMessage("");
		showSpinner1();
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
		var fileName = $('#fileName').val();
		var fileText = $('#fileText').val();

		if (!fileName.length > 0) {
			setCreateResponseMessage("File Name is Required");
			return;
		}
		showSpinner0();
		setCreateResponseMessage("");
		
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
		setConcatResponseMessage("");
		showSpinner2();
		var fileName = $('#fileNameWithContentsConc').val();

		var url = "/api/values/ConcatenateWithContents";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb);
	});

	var createNBBtn = $('#createNBBtn');
	createNBBtn.click(function () {

		var fileName = $('#fileNameNB').val();
		if (!fileName.length > 0) {
			setCreateResponseMessage("File Name is Required");
			return;
		}
		setCreateNBResponseMessage("");
		showSpinner3();
		var url = "/api/values/CreateFileWithNB";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileNBSuccessClb);
	});
});

// CALLBACKS

     // SUCCESS CLB
function createFileSuccessClb(response) {
	hideSpinners();

	setCreateResponseMessage(response.message);

	if (response.success) {
		var url = baseUrl + response.fileName;
		window.open(url, targetModes.Blank);
	} 
}

function concatFileSuccessClb(response) {
	hideSpinners();
	setConcatResponseMessage(response.message);

	if (response.success) {
		var url = baseUrl + response.fileName;
		window.open(url, targetModes.Blank);
	}
}

function uploadFileSuccessClb(response) {
	hideSpinners();
	setUploadResponseMessage(response.message);
}

function createFileNBSuccessClb(response) {
	hideSpinners();
	setCreateNBResponseMessage(response.message);
	if (response.success) {
		var url = baseUrl + response.fileName;
		window.open(url, targetModes.Blank);
	}
}
     // ERROR CLB  *Not used
function concatFileErrorClb(response) {
	hideSpinners();
	setConcatResponseMessage("Could not Concatenate files!");
}
function createFileErrorClb(response) {
	hideSpinners();
	setCreateResponseMessage("Could not Create File!");
}
function uploadFileErrorClb(response) {
	hideSpinners();
	setCreateResponseMessage("Could not Create File!");
}
function createFileNBErrorClb(response) {
	hideSpinners();
	setCreateNBResponseMessage("Could not Create File!");
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
			hideSpinners();
			
			if (callback) callback(data);
		},
		failure: function (data) {
			hideSpinners();
			alert("Error!");
		},
		error: function (data) {
			hideSpinners();
			alert("Error");
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
			var url = '/api/values/UploadFile';
			var data = {
				filename: fileName.name,
				filecontent: base64CodedImg
			};
			var dataType = '';
			CallWS("POST", url, "json", data, "application/json;charset=utf-8", uploadFileSuccessClb);
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
