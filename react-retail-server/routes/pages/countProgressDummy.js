
window.onload = function() {
	var barChartData = {
		labels: ["D 1", "D 2", "D 3", "D 4", "D 5", "D 6", "D 7", "D 8", "D 9", "D 10", "D 1", "D 2", "D 3", "D 4", "D 5", "D 6", "D 7", "D 8", "D 9", "D 10"],
		datasets: [{
			label: 'Match',
			backgroundColor: 'green',
			data: ["10", "100", "120", "140", "160", "180", "200", "210", "220", "240", "10", "100", "120", "140", "160", "180", "200", "210", "220", "240"]
		}, {
			label: 'Unders',
			backgroundColor: 'red',
			data: ["10", "100", "120", "140", "160", "180", "200", "210", "220", "240", "10", "100", "120", "140", "160", "180", "200", "210", "220", "240"]
		}, {
			label: 'Overs',
			backgroundColor: 'blue',
			data: ["10", "100", "120", "140", "160", "180", "200", "210", "220", "240", "10", "100", "120", "140", "160", "180", "200", "210", "220", "240"]
		}]	
	};
	var ctx = document.getElementById('canvas').getContext('2d');
	window.myBar = new Chart(ctx, {
		type: 'bar',
		data: barChartData,
		options: {
			title: {
				display: true,
				text: 'Chart'
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			responsive: true,
			scales: {
				xAxes: [{
					stacked: true,
					ticks: {
						mirror: false,
					}
				}],
				yAxes: [{
					stacked: true
				}]
			}
		}
	});
};
