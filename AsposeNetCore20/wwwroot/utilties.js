//Constants

// Local: "https://localhost:44340/"   & 
// Azure: "https://athennianasposepdftool.azurewebsites.net/"

var baseUrl = "https://athennianasposepdftool.azurewebsites.net/";

var targetModes = {
	Blank: "_blank",
	Parent: "_parent"
};

$(document).ready(function () {

	// EVENTS

	// @ ASPOSE TAB
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

	var createBKBtn = $('#createBKBtn');
	createBKBtn.click(function () {

		var fileName = $('#fileNameBK').val();
		if (!fileName.length > 0) {
			setCreateResponseMessage("File Name is Required");
			return;
		}
		setCreateBKResponseMessage("");
		showSpinner4();
		var url = "/api/values/CreateFileWithBK";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileBKSuccessClb);
	});

	// @ ACTIVE PDF

	var createActvBtn = $('#createHWBtn-actv');
	createActvBtn.click(function () {
		var fileName = $('#fileName-actv').val();
		var fileText = $('#fileText-actv').val();

		if (!fileName.length > 0) {
			setCreateResponseMessageActv("File Name is Required");
			return;
		}
		showSpinner0actv();
		setCreateResponseMessageActv("");

		var url = "/api/activepdf/CreateFile";
		var request = {
			filename: fileName,
			filetext: fileText
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", createFileSuccessClbActv);
	});

	var mergeBtn = $('#mergeFilesBtn-actv');
	mergeBtn.click(function () {
		showSpinner1actv();
		var fileName = $('#fileNameMerge-actv').val();

		var url = "/api/activepdf/Merge";
		var request = {
			filename: fileName
		};
		CallWS("POST", url, "json", request, "application/json;charset=utf-8", concatFileSuccessClb);
	});

	// UI events
	var showActivePdfBtn = $('#show-activePdf');
	showActivePdfBtn.click(function () {
		showActivePdfArea();
	});

	var showAsposePdfBtn = $('#show-asposePdf');
	showAsposePdfBtn.click(function () {
		showAsposePdfArea();
	});


	// CALLBACKS

	// SUCCESS CLB
	function createFileSuccessClb(response) {
		hideAsposeSpinners();

		setCreateResponseMessage(response.message);

		if (response.success) {
			var url = baseUrl + response.fileName;
			window.open(url, targetModes.Blank);
		}
	}

	function createFileSuccessClbActv(response) {
		hideActiveSpinners();

		setCreateResponseMessageActv(response.message);

		if (response.success) {
			var url = baseUrl + response.fileName;
			window.open(url, targetModes.Blank);
		}
	}

	function concatFileSuccessClb(response) {
		hideAsposeSpinners();
		setConcatResponseMessage(response.message);

		if (response.success) {
			var url = baseUrl + response.fileName;
			window.open(url, targetModes.Blank);
		}
	}

	function uploadFileSuccessClb(response) {
		hideAsposeSpinners();
		setUploadResponseMessage(response.message);
	}

	function createFileNBSuccessClb(response) {
		hideAsposeSpinners();
		setCreateNBResponseMessage(response.message);
		if (response.success) {
			var url = baseUrl + "File_With_NB.pdf";
			window.open(url, targetModes.Blank);
		}
	}
	function createFileBKSuccessClb(response) {
		hideAsposeSpinners();
		setCreateBKResponseMessage(response.message);
		if (response.success) {
			var url = baseUrl + "File_With_BK.pdf";
			window.open(url, targetModes.Blank);
		}
	}
	// ERROR CLB  *Not used
	function concatFileErrorClb(response) {
		hideAsposeSpinners();
		setConcatResponseMessage("Could not Concatenate files!");
	}
	function createFileErrorClb(response) {
		hideAsposeSpinners();
		setCreateResponseMessage("Could not Create File!");
	}
	function uploadFileErrorClb(response) {
		hideAsposeSpinners();
		setCreateResponseMessage("Could not Create File!");
	}
	function createFileNBErrorClb(response) {
		hideAsposeSpinners();
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
				hideAsposeSpinners();
				hideActiveSpinners()
				if (callback) callback(data);
			},
			failure: function (data) {
				hideAsposeSpinners();
				hideActiveSpinners()
				alert("Error!");
			},
			error: function (data) {
				hideAsposeSpinners();
				hideActiveSpinners()
				alert("Error");
			}
		});
	}




	// HELPERS
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

});