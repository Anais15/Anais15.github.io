var bitcoin_change = 0;
var euro_converted = 0;
var block_number;
var displayed_blocks_number = 10;

$(document).ready(function() {
//change en EUR
$.ajax({
	url : "https://apiv2.bitcoinaverage.com/indices/global/ticker/BTCEUR",
	dataType : "json",
	contentType : "application/json; charset=utf-8",
	type : "GET",
	timeout:	"5000",
	async : true,

	success : function(data) {
		bitcoin_change = data.last;
		$('#percent_variation').append(data.changes.percent.day);
		$('#price_variation').append(data.changes.price.day);
		if(data.changes.percent.day > 0)
		{
			$('.fleche').removeClass().addClass('fa fa-caret-up');
		}
		else{
			$('.fleche').removeClass().addClass('fa fa-caret-down');
		}
		$('#volume').append(data.volume);
		$('#bitcoin_change').append(bitcoin_change);

	},

	error : function(xhr, status, err) {
		$('#bitcoin_change').append(err+" N/A");
	}
});

$.ajax({
		url: 		"https://bitcoin.mubiz.com/info",
		dataType:	"json",
		contentType: "application/json; charset=utf-8",
		type:  		"GET",
		//timeout:	"5000",
		async:		false,
		
		success: function(data){
			$('#blocks').append(number_format(data.blocks,0,'.',' '));
			//$('#network_hash').append(number_format(data.difficulty,0,'.',' '));
			block_number=data.blocks;
		},
		
		error: function(xhr, status, err){
			$('#blocks').append("N/A");
			//$('#network_hash').append("N/A");
		}
	});

	for(var i=0 ; i < displayed_blocks_number ; i++){
		var block_index = block_number-i;
		
		$.ajax({
			url: 		"https://bitcoin.mubiz.com/block_index/"+block_index+"/",
			dataType:	"json",
			contentType: "application/json; charset=utf-8",
			type:  		"GET",
			//timeout:	"5000",
			async:		false,
			
			success: function(data_index){
				// Si rÃ©cupÃ©ration du hash, alors appel des donnÃ©es des donnÃ©es du bloc
				$.ajax({
					url: 		"https://bitcoin.mubiz.com/block_hash/"+data_index.block_hash+"/",
					dataType:	"json",
					contentType: "application/json; charset=utf-8",
					type:  		"GET",
					//timeout:	"5000",
					async:		false,
					
					success: function(data_hash){
						var delta_time=Date.now()-parseInt(data_hash.time)*1000;
						
						$('#block_list').append(	'<tr class="block_summary" id="'+block_index+'">'
														+'<td><a href="https://mubiz.com/bitcoin/block/'+block_index+'/">'+number_format(block_index,0,'.',' ')+'</a></td>'
														+'<td>'+data_index.block_hash+'</td>'
														+'<td>'+unixtime_to_date(data_hash.time)+'<br/>( Il y a '+unixtime_to_delay(delta_time)+')</td>'
														+'<td>'+number_format((data_hash.size/1024),2,'.',' ')+' Ko</td>'
													+'</tr>');
					},
				
					error: function(xhr, status, err){
						//$('#block_list').append("N/A");
					}
				});
			},
			
			error: function(xhr, status, err){
				//$('#block_list').append("N/A");
			}
		});
		
	}



});








/**********************************
 * 
 *  FUNCTIONS AND TOOLS 
 *  
 *********************************/

function ConvertToEuro() {
	euro_converted = (bitcoin_change * $('#bitcoin_to_change')[0].value).toFixed(2);
	$('#euro_converted')[0].value = euro_converted;
}

function ConvertToBitcoin() {
	bitcoin_converted =($('#euro_converted')[0].value / bitcoin_change).toFixed(8);
	$('#bitcoin_to_change')[0].value = bitcoin_converted;
}

function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum/1000;
}
/**
 * Transforme un unix_time_stamp en une date lisible.
 */
function unixtime_to_date(unix_timestamp) {
	var a = new Date(unix_timestamp * 1000);

	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();

	// Hours part from the timestamp
	var hours = a.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + a.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + a.getSeconds();

	return date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}


function unixtime_to_delay(unix_timedelay) {
	var seconds = Math.floor(unix_timedelay / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);

	hours = hours - (days * 24);
	minutes = minutes - (days * 24 * 60) - (hours * 60);
	seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

	var result = '';
	if (days > 0)
		result = result + days + ' jours ';
	if (hours > 0)
		result = result + hours + ' heures ';
	if (minutes > 0)
		result = result + minutes + ' min ';
	if (seconds > 0)
		result = result + seconds + ' sec ';

	return result;
}
function number_format(number, decimals, decPoint, thousandsSep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
	var n = !isFinite(+number) ? 0 : +number
	var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
	var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
	var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
	var s = ''

	var toFixedFix = function (n, prec) {
		var k = Math.pow(10, prec)
		return '' + (Math.round(n * k) / k)
				.toFixed(prec)
	}

	// @todo: for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}

	return s.join(dec)
}