
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
		var fileName = $('#fileNameConc').val();

		var url = "/api/values/Concatenate";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb, concatFileErrorClb);
	});
});

function concatFileSuccessClb(response) {
	console.log(response);
	alert("Files Concatenated successfully");
}
function concatFileErrorClb(response) {
	alert("Files Concatenated successfully");
}

function createFileSuccessClb(response) {
	console.log(response);
	alert("File created successfully");
}
function createFileErrorClb(response) {
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
			console.log(data);
			if (callback) callback(data);
		},
		failure: function (data) {
			alert("File created successfully");
		},
		error: function (data) {
			alert("File created successfully");
		}

	});
}
