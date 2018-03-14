/**
 * 
 */
var chartData;
var incidentsList = new Array();
// Set a callback to run when the Google Visualization API is loaded.
// google.charts.setOnLoadCallback(drawChart);
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
	// Great success! All the File APIs are supported.
} else {
	alert('The File APIs are not fully supported in this browser.');
}
$(window).resize(function(){
  	plotData(data);
});
var config = {
	delimiter : "", // auto-detect
	newline : "", // auto-detect
	quoteChar : '"',
	header : false,
	dynamicTyping : false,
	preview : 0,
	encoding : "",
	worker : false,
	comments : false,
	step : undefined,
	complete : function(results) {
		reloadData(results);
	},
	error : undefined,
	download : true,
	skipEmptyLines : false,
	chunk : undefined,
	fastMode : undefined,
	beforeFirstChunk : undefined,
	withCredentials : undefined
};

function reloadData(results) {
	console.log("Finished:", results.data);
	data = results.data;
	data.pop();
	plotData(results.data);
}

function plotData(data) {
	var testDate = Date.parse(data[1][6]);
	var test = new Date(testDate);
	console.log(data[1][6]);
	console.log(test.getUTCDate() + "!" + test.getUTCFullYear() + "!"
			+ test.getUTCSeconds());

	document.getElementById('files').addEventListener('change',
			handleFileSelect, false);
	mostCommonIncident(data);
	numIncidentTypeinZipcode(data);
	timeModel(data);
}

// model the time data for each type of incident
function timeModel(data) {
	// create map to store incidents and their times of occurence
	var incidentMap = new Map();
	for (var incIn = 1; incIn < data.length; incIn++) {
		var parsedDate = Date.parse(data[incIn][6]);
		var currentDate = new Date(parsedDate);
		if (incidentMap.get(data[incIn][3]) != null) {
			var numIncidents = incidentMap.get(data[incIn][3]).get(
					currentDate.getUTCHours()) + 1;
			incidentMap.get(data[incIn][3]).set(currentDate.getUTCHours(),
					numIncidents);
		} else {
			// create map to store time data
			var timeList = new Map();
			for (var i = 0; i < 24; i++) {
				timeList.set(i, 0);
			}
			timeList.set(currentDate.getUTCHours(), 1);
			incidentMap.set(data[incIn][3], timeList);
		}
	}
	google.charts.setOnLoadCallback(drawChart3(incidentMap));
}

// draw chart3
function drawChart3(incidentMap) {
	var chartData = new Array();
	var axisLabels = new Array();
	axisLabels.push("Incident Type");
	var incidentMAKeys = Array.from(incidentMap.keys());
	for (var i = 0; i < incidentMAKeys.length; i++) {
		axisLabels.push(incidentMAKeys[i]);
	}
	chartData.push(axisLabels);
	var incidentMapArray = Array.from(incidentMap.entries());
	var incidentTimesKeys = Array.from(incidentMapArray[0][1].keys());
	for (var j = 0; j < incidentTimesKeys.length; j++) {
		var rowData = new Array();
		rowData.push(incidentTimesKeys[j]);
		chartData.push(rowData);
	}
	for (var g = 0; g < incidentMapArray.length; g++) {
		var incidentTimeArray = Array.from(incidentMapArray[g][1]);
		for (var t = 1; t < chartData.length; t++) {
			chartData[t].push(incidentTimeArray[t - 1][1]);
		}
	}

	var data = google.visualization.arrayToDataTable(chartData);
	var options = {
		title : 'Incident Occurences Each Hour of the Day',
		titleTextStyle : {
			fontSize : 30,
			bold : true
		},
		'height' : 500,
		hAxis : {
			title : 'Hour (24 Time Scale)',
			titleTextStyle : {
				color : '#333'
			}
		},
		vAxis : {
			minValue : 0
		},
		legend : {
			position : 'right'
		},
		backgroundColor : {
			stroke : '#E5E7E9',
			strokeWidth : 4,
		}
	};

	var chart = new google.visualization.AreaChart(document
			.getElementById('chart3_div'));
	chart.draw(data, options);
}

// find the number of each incident in a zipcode
function numIncidentTypeinZipcode(data) {
	var zipcode = new Map();
	// store how many of each incident occurred in each zipcode in a map
	for (var zipIn = 1; zipIn < data.length; zipIn++) {
		// see if the zipcode already has a key
		if (zipcode.get(data[zipIn][17]) != null) {
			var numIncidents = zipcode.get(data[zipIn][17]).get(data[zipIn][3]) + 1;
			zipcode.get(data[zipIn][17]).set(data[zipIn][3], numIncidents);
		} else {
			// make a map whose keys are the incidents
			var incidentMap = new Map();
			for (var incIn = 0; incIn < incidentsList.length; incIn++) {
				incidentMap.set(incidentsList[incIn], 0);
			}
			incidentMap.set(data[zipIn][3], 1);
			zipcode.set(data[zipIn][17], incidentMap);
		}
	}
	google.charts.setOnLoadCallback(drawChart2(zipcode));
}

// draw the second chart
function drawChart2(zipcode) {
	var chartData2 = Array.from(zipcode.entries());
	var zipcodeKeys = Array.from(zipcode.keys());
	// make data header
	var dataHeader = new Array();
	dataHeader.push("Incident_Type");
	for (var p = 0; p < incidentsList.length; p++) {
		dataHeader.push(incidentsList[p]);
	}
	// dataHeader.push("{ role: 'annotation' }");
	var dataArray = new Array();
	dataArray.push(dataHeader);
	// make arrays for zipcode and incident nums
	for (var i = 0; i < chartData2.length; i++) {
		var zipIncNums = new Array();
		zipIncNums.push(zipcodeKeys[i]);
		var incNumsArray = Array.from(chartData2[i][1]);
		for (var j = 0; j < incNumsArray.length; j++) {
			zipIncNums.push(incNumsArray[j][1]);
		}
		// zipIncNums.push(0);
		dataArray.push(zipIncNums);
	}
	// make chart
	var data = new google.visualization.arrayToDataTable(dataArray);

	// Set chart options
	var options = {
		title : 'Number of Incidents Per Zipcode',
		titleTextStyle : {
			fontSize : 30,
			bold : true
		},
		'height' : 500,
		legend : {
			position : 'right',
		},
		bar : {
			groupWidth : '75%'
		},
		isStacked : true,
		backgroundColor : {
			stroke : '#E5E7E9',
			strokeWidth : 4,
		}
	};

	// Instantiate and draw our chart, passing in some options.
	var view = new google.visualization.DataView(data);
	var chart = new google.visualization.ColumnChart(document
			.getElementById('chart2_div'));
	chart.draw(data, options);
}

// tallies the number of each incident
function mostCommonIncident(data) {
	var incidents = new Map();
	for (var incIn = 1; incIn < data.length; incIn++) {
		if (incidents.get(data[incIn][3]) != null) {
			var numIncidents = incidents.get(data[incIn][3]) + 1;
			incidents.set(data[incIn][3], numIncidents);
		} else {
			incidents.set(data[incIn][3], 1);
		}
	}
	google.charts.setOnLoadCallback(drawChart(incidents));
}

function drawChart(incidents) {
	// make map into array for the chart
	incidentsList = Array.from(incidents.keys()).sort();
	chartData = Array.from(incidents.entries());
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Incident_Type');
	data.addColumn('number', 'Number_Of_Incidents');
	data.addRows(chartData);

	// Set chart options
	var options = {
		'title' : 'Number of Incident Occurences',
		titleTextStyle : {
			fontSize : 30,
			bold : true
		},
		// sliceVisibilityThreshold : .005,
		chartArea : {
			width : '80%',
			height : '75%'
		},
		'height' : 500,
		backgroundColor : {
			stroke : '#E5E7E9',
			strokeWidth : 4,
		}
	};
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document
			.getElementById('chart_div'));
	chart.draw(data, options);
}

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	// files is a FileList of File objects. List some properties.
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
//		output.push('<li><strong>', escape(f.name), '</strong> (', f.type
//				|| 'n/a', ') - ', f.size, ' bytes, last modified: ',
//				f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString()
//						: 'n/a', '</li>');
	}

	document.getElementById('list').innerHTML = '<ul>' + output.join('')
			+ '</ul>';
	Papa.parse(files[0], config);
}
