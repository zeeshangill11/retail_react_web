
	var ctx3 = document.getElementById('canvas3').getContext('2d');
	var ctx4 = document.getElementById('canvas4').getContext('2d');
	var ctx = document.getElementById('canvas').getContext('2d');
	var ctx2 = document.getElementById('canvas2').getContext('2d');


	window.onload = function() {
	var data = {
    labels: ["match1", "match2", "match3", "match4", "match5"],
    datasets: [
      {
        label: "TeamA Score",
        data: [10, 50, 25, 70, 40],
        backgroundColor: "blue",
        borderColor: "lightblue",
        fill: false,
        lineTension: 0,
        radius: 5
      },
      {
        label: "TeamB Score",
        data: [20, 35, 40, 60, 50],
        backgroundColor: "green",
        borderColor: "lightgreen",
        fill: false,
        lineTension: 0,
        radius: 5
      }
    ]
  };

	window.myBar = new Chart(ctx, {
		type: 'line',
		data: data,
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


	window.myBar = new Chart(ctx2, {
		type: 'line',
		data: data,
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

	window.myBar = new Chart(ctx3, {
		type: 'line',
		data: data,
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

window.myBar = new Chart(ctx4, {
		type: 'line',
		data: data,
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


