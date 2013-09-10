// NAICS-API search example
'use strict'

var naics
var naicsAPI = 'http://api.naics.us/v0/q?year=2012&collapse=1&titlesonly=1'
var naicsURL
var naicsLocal,
    naicsRemote
var naicsItem

$(document).ready(function() {

    // load NAICS
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
    });

    // SELECT2

    // format data
    for (var i = 0; i < naics.length; i++) {
        naics[i].id = naics[i].code
    }

    // format selection things
    function formatSelection(item) { return item.title }
    function formatResult(item) { return '<small>' + item.code + '</small> <strong>' + item.title + '</strong>' }

    // select2 init
    $('#naics-select').select2({
        allowClear: true,
        minimumInputLength: 1,
        data: { results: naics, text: 'title' },
        formatSelection: formatSelection,
        formatResult: formatResult,
        placeholder: 'Enter some keywords about your business',
    }).select2('open')

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
            $(this).removeClass('btn-success')
        }
        else {
            $('#naics-table .btn').removeClass('btn-success')
            $(this).addClass('btn-success')            
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

        row.html('<td class="col-md-1"><button class="close text-left">&times;</button></td><td class="col-md-10 text-left"><span> <i class="icon-eye-open"></i> <strong>' + title + '</strong> <small>' + code +'</small></span></td><td class="col-md-1"><button class="btn btn-small">Primary</button></td>')            
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


