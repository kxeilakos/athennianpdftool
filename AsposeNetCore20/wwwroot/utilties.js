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
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileSuccessClb);
	});

	var concatenateBtn = $('#concatenateBtn');
	concatenateBtn.click(function () {
		var fileName = $('#fileNameConc').val();

		var url = "/api/values/Concatenate";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileSuccessClb);
	});

});

function createFileSuccessClb(response) {
	console.log(response);
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
			console.log(data);
		},
		error: function (data) {
			console.log(data);
		}

	});
}