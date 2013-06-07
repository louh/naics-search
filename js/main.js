
// NAICS-API search example

var naics
var naicsAPI = 'http://naics-api.herokuapp.com/v0/q?year=2012'
var naicsFile = 'data/naics-2012.json'
var naicsURL
var naicsLocal,
    naicsRemote
var naicsItem

$(document).ready(function() {

    naicsURL = naicsAPI

    // load NAICS
    $.ajax({
        url: naicsURL,
        async: false,
        dataType: 'json',
        success: function(data) {
            naics = data;
        }
    });

    // convert input to typeahead.js datums
    for ( var i = 0; i < naics.length; i++ ) {
        naics[i].tokens = naics[i].title.split(' ')
    }

    // TYPEAHEAD.js
    $('#typebox').typeahead({
        name: 'naics',
//        remote: naics.items,
        local: naics,
        valueKey: 'title',
        limit: 10,
        template: '<p><small>{{code}}</small> <strong>{{title}}</strong></p>',
        engine: Hogan
    });


    // INTERACTIONS

    // enable 'add' button after typeahead option is selected
    $('#typebox').on('typeahead:selected', function (e) {
        $('input[type=submit]').prop('disabled', false)
    })


    $('#typebox').keyup(function() {
        if ($(this).val() == '') { //Check to see if there is any text entered
            //If there is no text within the input ten disable the button
            $('input[type=submit]').prop('disabled', true)
        }
    });


    // add a row
    $('#naics-search .btn-primary').on('click', function (e) {
        e.preventDefault()

        if ($('#typebox') != '') {
            var row = $('<tr></tr>').appendTo('tbody')
            // TO DO: Get NAICS code to display here.
            row.html('<td class="span1"><button class="close pull-left">&times;</button></td><td class="span10"><span> <strong>' + $('#typebox').val() +'</strong> <small></small></span></td><td class="span1"><button class="btn btn-small">Primary</button></td>')            
        }

        // set instructions in the table below
        if ($('#no-table').is(":visible")) {
            $('#no-table').hide()
            $('#yes-table').show()
        }

        // Reset form
        $('input[type=submit]').prop('disabled', true)
        $('#typebox').typeahead('setQuery', '')
        $('#typebox').focus()
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
