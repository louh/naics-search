// NAICS-API search example
'use strict';

var naics
var naicsAPI = 'http://api.naics.us/v0/q?year=2012&collapse=1&titlesonly=1'
var naicsURL
var naicsLocal,
	naicsRemote
var naicsItem

$(document).ready(function() {

	// load NAICS
	/*
	$.ajax({
		url: naicsAPI,
		async: false,
		dataType: 'json',
		success: function(data) {
			naics = data;
		},
		failure: function(x) {
			document.write('Error loading NAICS data')
		}
	});*/
	var naicsXHR = $.get(naicsAPI, function(data) {
		naics = data
	}).done( function () {
		// format data
		for (var i = 0; i < naics.length; i++) {
			naics[i].id = naics[i].code
		}

		$('#loading-msg').hide()

		// select2 init
		$('#naics-select').select2({
			allowClear: true,
			minimumInputLength: 1,
			data: { results: naics, text: 'title' },
			formatSelection: formatSelection,
			formatResult: formatResult,
			placeholder: 'Enter some keywords about your business',
		}).select2('open')

	}).fail( function () {
		document.write('Error loading NAICS data')
	})

	// SELECT2

	// format selection things
	function formatSelection(item) { return item.title }
	function formatResult(item) { return '<small>' + item.code + '</small> <strong>' + item.title + '</strong>' }

	$('#naics-select').on('select2-selecting', function (e) {
		$('#naics-add').prop('disabled', false)
	})
	$('#naics-select').on('select2-removed', function (e) {
		$('#naics-add').prop('disabled', true)
	})

	// INTERACTIONS

	// add a row
	$('#naics-add').on('click', function (e) {
		e.preventDefault()
		addRow()
	})

	// delete a row
	$('#naics-table').on('click', 'button.close', function() {
		$(this).parent().parent().remove()

		if ($('tbody').html().trim() == '') {
			$('#yes-table').hide()
			$('#no-table').show()
		}

	})

	// mark as primary
	$('#naics-table').on('click', 'button.btn', function () {
		if ($(this).hasClass('btn-success')) {
			// toggle
			$(this).removeClass('btn-success').text('Mark as primary')
		}
		else {
			$('#naics-table .btn').removeClass('btn-success').text('Mark as primary')
			$(this).addClass('btn-success').text('Primary')
		}
	})

	// view description on hover
	$('#naicstable i').hover( function () {

	})

})

function addRow () {
	if ($('#naics-select').select2('val') != '') {
		var row = $('<tr></tr>').appendTo('tbody')

		var title = $('#naics-select').select2('data').title
		var code = $('#naics-select').select2('val')

		row.html('<td style="width: 60px"><button class="close pull-left">&times;</button></td><td class="text-left"><span class="glyphicon glyphicon-eye-open"></span> <strong>' + title + '</strong> <small>' + code +'</small></td><td class="text-right" style="width: 160px"><button class="btn btn-small btn-default">Mark as primary</button></td>')            
	}

	// set instructions in the table below
	if ($('#no-table').is(":visible")) {
		$('#no-table').hide()
		$('#yes-table').show()
	}

	// Reset form
	$('#naics-add').prop('disabled', true)
	$('#naics-select').select2('val', '').select2('open')
}


