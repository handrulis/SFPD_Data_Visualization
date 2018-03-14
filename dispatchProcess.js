/**
 * 
 */
var inputAddress = "";
var inputTime = "";
zipcodeIncidentResponse();
function zipcodeIncidentResponse() {
	var zipcode = new Map();
	// store how many of each incident occurred in each zipcode in a map
	for (var zipIn = 1; zipIn < data.length; zipIn++) {
		var parsedDate = Date.parse(data[zipIn][6]);
		var currentDate = new Date(parsedDate);
		// see if the zipcode already has a key
		if (zipcode.get(data[zipIn][17]) != null) {
			// check to see if that hour has been entered before
			if (zipcode.get(data[zipIn][17]).get(currentDate.getUTCHours()) != null) {
				// check to see if that incident has been enter before
				if (zipcode.get(data[zipIn][17]).get(currentDate.getUTCHours())
						.get(data[zipIn][27]) != null) {
					var numIncidents = zipcode.get(data[zipIn][17]).get(
							currentDate.getUTCHours()).get(data[zipIn][27]) + 1;
					zipcode.get(data[zipIn][17]).get(currentDate.getUTCHours());
				} else {
					zipcode.get(data[zipIn][17]).get(currentDate.getUTCHours())
					.set(data[zipIn][27], 1);
				}
			} else {
				var responseMap = new Map();
				timeMap.set(currentDate.getUTCHours(), responseMap.set(
						data[zipIn][27], 1));
				zipcode.set(data[zipIn][17], timeMap);
			}
		} else {
			// make a map whose keys are the hours
			var timeMap = new Map();
			var responseMap = new Map();
			for (var time = 0; time < 24; time++) {
				timeMap.set(time, 0);
			}
			timeMap.set(currentDate.getUTCHours(), responseMap.set(
					data[zipIn][27], 1));
			zipcode.set(data[zipIn][17], timeMap);
			zipcode.get(data[zipIn][17]).get(currentDate.getUTCHours()).set();
		}
	}
	console.log(zipcode);
}