
function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum/1000;
}

$.getJSON('https://apiv2.bitcoinaverage.com/indices/global/history/BTCEUR?format=json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
    volume = [],
    dataLength = data.length,
    // set the allowed units for data grouping
    groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
        ], [
        'month',
        [1, 2, 3, 4, 6]
        ]],

        i = 0;
        function Comparator(a, b) {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          return 0;
        }

        data = data.sort(Comparator);

        for (i; i < dataLength; i += 1) {
          ohlc.push([
            toTimestamp(data[i].time)*1000, // the date
            data[i].average, // open
            ]);

          volume.push([
            toTimestamp(data[i].time)*1000, // the date
            data[i].volume// the volume
            ]);
        }

      // create the chart
      Highcharts.stockChart('chart', {

        rangeSelector: {
          selected: 1
        },

        title: {
          text: 'Historique bitcoin'
        },

        yAxis: [{
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },

        series: [{
          type: 'area',
          name: 'Bitcoin',
          data: ohlc,
          dataGrouping: {
            units: groupingUnits
          }
        }, {
          type: 'column',
          name: 'Volume',
          data: volume,
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          }
        }]
    });
});
Highcharts.theme = {
   colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee',
      '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: null,
      style: {
         fontFamily: 'Signika, serif'
      }
   },
   title: {
      style: {
         color: 'black',
         fontSize: '16px',
         fontWeight: 'bold'
      }
   },
   subtitle: {
      style: {
         color: 'black'
      }
   },
   tooltip: {
      borderWidth: 0
   },
   legend: {
      itemStyle: {
         fontWeight: 'bold',
         fontSize: '13px'
      }
   },
   xAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   yAxis: {
      labels: {
         style: {
            color: '#6e6e70'
         }
      }
   },
   plotOptions: {
      series: {
         shadow: true
      },
      candlestick: {
         lineColor: '#404048'
      },
      map: {
         shadow: false
      }
   },

   // Highstock specific
   navigator: {
      xAxis: {
         gridLineColor: '#D0D0D8'
      }
   },
   rangeSelector: {
      buttonTheme: {
         fill: 'white',
         stroke: '#C0C0C8',
         'stroke-width': 1,
         states: {
            select: {
               fill: '#D0D0D8'
            }
         }
      }
   },
   scrollbar: {
      trackBorderColor: '#C0C0C8'
   },

   // General
   background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);