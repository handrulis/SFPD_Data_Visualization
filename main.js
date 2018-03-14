/**
 * 
 */
var map, heatmap;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom : 13,
		center : {
			lat : 37.775,
			lng : -122.434
		},
		mapTypeId : 'satellite'
	});

	heatmap = new google.maps.visualization.HeatmapLayer({
		data : getPoints(),
		map : map
	});
}

function toggleHeatmap() {
	heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
	var gradient = [ 'rgba(0, 255, 255, 0)', 'rgba(0, 255, 255, 1)',
			'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)',
			'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)',
			'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)',
			'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)',
			'rgba(255, 0, 0, 1)' ]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
	heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
	heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
	var points = [];
	for (var i = 1; i < data.length; i++) {
		var lat = parseFloat(data[i][34]);
		var long = parseFloat(data[i][35]);
		points.push(new google.maps.LatLng(lat, long));
	}
	
	return points;

}
