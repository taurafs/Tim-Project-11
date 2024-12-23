(function ($) {
  'use strict';
  
if ($("#traffic-chart").length) {
  const ctx = document.getElementById('traffic-chart');

 // Get the context of the canvas only once
var graphGradient = document.getElementById("traffic-chart").getContext('2d');

// Create the first gradient (Blue)
var gradientStrokeBlue = graphGradient.createLinearGradient(0, 0, 0, 181);
gradientStrokeBlue.addColorStop(0, 'rgb(59, 83, 85)');
var gradientLegendBlue = 'rgb(59, 83, 85)';

// Create the second gradient (Red)
var gradientStrokeRed = graphGradient.createLinearGradient(0, 0, 0, 50);
gradientStrokeRed.addColorStop(0, 'rgb(26, 38, 38)');
var gradientLegendRed = 'rgb(26, 38, 38)';

// Create the third gradient (Green)
var gradientStrokeGreen = graphGradient.createLinearGradient(0, 0, 0, 300);
gradientStrokeGreen.addColorStop(0, 'rgb(87, 153, 159)');
var gradientLegendGreen = 'rgb(87, 153, 159)';

var gradientStrokeGrey = graphGradient.createLinearGradient(0, 0, 0, 199);
gradientStrokeGrey.addColorStop(0, 'rgb(217, 217, 217)');
gradientStrokeGrey.addColorStop(1, 'rgb(200, 200, 200)'); 

var gradientLegendGrey = 'rgb(217, 217, 217)';
;

  // Create the traffic chart (initial setup)
var trafficChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Money Transfer', 'Rent', 'Food And Groceries', 'Other'],  // Default labels, will be replaced with dynamic ones
    datasets: [{
      data: [30, 30, 40, 50],  // Default data, will be replaced with dynamic values
      backgroundColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed, gradientStrokeGrey],  // Default colors
      hoverBackgroundColor: [
        gradientStrokeBlue,
        gradientStrokeGreen,
        gradientStrokeRed,
        gradientStrokeGrey
      ],
      borderColor: [
        gradientStrokeBlue,
        gradientStrokeGreen,
        gradientStrokeRed,
        gradientStrokeGrey,
      ],
      legendColor: [
        gradientLegendBlue,
        gradientLegendGreen,
        gradientLegendRed,
        gradientLegendGrey,
      ]
    }]
  },
  options: {
    cutout: 50,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    responsive: true,
    maintainAspectRatio: true,
    showScale: true,
    legend: false,
    plugins: {
      legend: {
        display: false,
      }
    }
  },
  plugins: [{
    afterDatasetUpdate: function (chart, args, options) {
      const chartId = chart.canvas.id;
      var i;
      const legendId = `${chartId}-legend`;
      const ul = document.createElement('ul');
      for (i = 0; i < chart.data.datasets[0].data.length; i++) {
        ul.innerHTML += `
          <li>
            <span style="background-color: ${chart.data.datasets[0].legendColor[i]}"></span>
            ${chart.data.labels[i]}
          </li>
        `;
      }
      return document.getElementById(legendId).appendChild(ul);
    }
  }]
});

var currentDate = new Date();
var month = currentDate.getMonth() + 1; // Months are 0-indexed
var year = currentDate.getFullYear();

var payload = {
  "user_id": 1,
  "bulan": month.toString().padStart(2, '0'),  // Ensure 2 digits for month
  "tahun": year.toString()
};
// Fetch dynamic data from API
$.ajax({
  url: 'http://localhost:8000/api/dashboard', // Adjust URL if needed
  method: 'GET',
  data: payload, // Assuming payload is predefined
  success: function(response) {
    if (response.status) {
      // Assuming the response contains the data for the traffic chart
      var chartData = response.data.chart_data;  // Fetch chart_data from the API response

      // Prepare the data for the chart dynamically
      var labels = [];
      var data = [];
      var backgroundColor = [
        gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed, gradientStrokeGrey
      ]; // Example color array

      chartData.forEach(function(item, index) {
        labels.push(item.kategori);  // Use the 'kategori' field as the label
        data.push(parseFloat(item.total));  // Use the 'total' field for the data points
      });

      // Update the chart with the fetched data
      trafficChart.data.labels = labels;
      trafficChart.data.datasets[0].data = data;
      trafficChart.data.datasets[0].backgroundColor = backgroundColor.slice(0, data.length);  // Adjust colors based on the data count

      // Re-render the chart
      trafficChart.update();
    } else {
      console.log('Error fetching data for traffic chart');
    }
  },
  error: function(xhr, status, error) {
    console.error('API request failed:', error);
  }
});

}

  if ($("#inline-datepicker").length) {
    $('#inline-datepicker').datepicker({
      enableOnReadonly: true,
      todayHighlight: true,
    });
  }
  if ($.cookie('purple-pro-banner') != "true") {
    document.querySelector('#proBanner').classList.add('d-flex');
    document.querySelector('.navbar').classList.remove('fixed-top');
  } else {
    document.querySelector('#proBanner').classList.add('d-none');
    document.querySelector('.navbar').classList.add('fixed-top');
  }

  if ($(".navbar").hasClass("fixed-top")) {
    document.querySelector('.page-body-wrapper').classList.remove('pt-0');
    document.querySelector('.navbar').classList.remove('pt-5');
  } else {
    document.querySelector('.page-body-wrapper').classList.add('pt-0');
    document.querySelector('.navbar').classList.add('pt-5');
    document.querySelector('.navbar').classList.add('mt-3');

  }
  document.querySelector('#bannerClose').addEventListener('click', function () {
    document.querySelector('#proBanner').classList.add('d-none');
    document.querySelector('#proBanner').classList.remove('d-flex');
    document.querySelector('.navbar').classList.remove('pt-5');
    document.querySelector('.navbar').classList.add('fixed-top');
    document.querySelector('.page-body-wrapper').classList.add('proBanner-padding-top');
    document.querySelector('.navbar').classList.remove('mt-3');
    var date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    $.cookie('purple-pro-banner', "true", {
      expires: date
    });
  });
})(jQuery);