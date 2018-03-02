/**
 * Created by longpham on 7/6/17.
 */

chrome.storage.local.get(function(result){console.log(result)});
chrome.storage.local.get(function(res){
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
    dataSet = res.dataSet;
    fieldNames = res.fieldNames;
    query = res.query;
    console.log(query);
        // dataSet = request.dataSet;
        // fieldNames = request.fieldNames;

    // localStorage = chrome.storage.local;

    // // Set up the editor
    // editor = new $.fn.dataTable.Editor( {
    //     table: "#data-table",
    //     fields: fieldNames,
    //     ajax: function ( method, url, d, successCallback, errorCallback ) {
    //         var output = { data: [] };
    //
    //         if ( d.action === 'create' ) {
    //             // Create new row(s), using the current time and loop index as
    //             // the row id
    //             var dateKey = +new Date();
    //
    //             $.each( d.data, function (key, value) {
    //                 var id = dateKey+''+key;
    //
    //                 value.DT_RowId = id;
    //                 todo[ id ] = value;
    //                 output.data.push( value );
    //             } );
    //         }
    //         else if ( d.action === 'edit' ) {
    //             // Update each edited item with the data submitted
    //             $.each( d.data, function (id, value) {
    //                 value.DT_RowId = id;
    //                 $.extend( todo[ id ], value );
    //                 output.data.push( todo[ id ] );
    //             } );
    //         }
    //         else if ( d.action === 'remove' ) {
    //             // Remove items from the object
    //             $.each( d.data, function (id) {
    //                 delete todo[ id ];
    //             } );
    //         }
    //
    //         // Store the latest `todo` object for next reload
    //         localStorage.setItem( 'todo', JSON.stringify(todo) );
    //
    //         // Show Editor what has changed
    //         successCallback( output );
    //     }
    // } );

    // fieldNames.push({title: "field1", sTitle: "New field 1"});
    // for (var i=0; i< dataSet.length; i++) {
    //     dataSet[i].push('');
    // }
    console.log(fieldNames);
    console.log(dataSet);
    $(document).ready(function() {
        var tbl = $('#data-table').DataTable( {
            data: dataSet,
            columns: fieldNames,
            // "columnDefs": [ {
            //     "targets": -1,
            //     "data": null,
            //     "defaultContent": "",
            //     "visible": false,
            // } ],
            paging: false,
            order: [],
            scrollX: "100%",
            scrollY: "600px",
            dom: 'Bfrtip',
            buttons: [
                //'copyHtml5',
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: ':visible'
                    }
                },
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
                // { extend: "create", editor: editor },
                // { extend: "edit",   editor: editor },
                // { extend: "remove", editor: editor }
            ]
        } );

        $('#data-table td').addClass('dropable').sortable({
            connectWith: ".dropable",
            cursor: "move"
        });
        $('.dt-buttons').append("<button id='selable'>Selectable</button>");
        $('.dt-buttons').append("<button id='notselable'>Not Selectable</button>");
        $('.dt-buttons').append("<button id='merge'>Merge</button>");
        $('.dt-buttons').append("<select id='select-query'> <option value='query1'>Query1</option> <option value='query2'>Query2</option> <option value='query3'>Query3</option> </select>");
        $('#select-query').val(query);
        $('.dt-buttons').append("<button class='toggle-vis'>Create New Field</button><input id='new-field-name-input' type='text' value='New field 1'></input>");

        //for creating new columns
        //tbl.column(-1).visible(false); 
        // $('button.toggle-vis').on( 'click', function (e) {
        //     e.preventDefault();

        //     // Get the column API object
        //     // var column = table.column(':contains("New field 1")');
        //     var column = tbl.column(-1);

        //     // Toggle the visibility
        //     if (!column.visible()) {
        //         column.visible( ! column.visible() );
        //     } else {
        //         alert('Now we support creating one new field only!')
        //     }

        //     $(column.header()).text($('#new-field-name-input').val());

        //     $('#data-table td').addClass('dropable').sortable({
        //         connectWith: ".dropable",
        //         cursor: "move"
        //     });
        // } );

        $('.dt-buttons').append("<button id='done-modification'>Done Modification</button>");
        $('button#done-modification').on( 'click', function (e) {
            e.preventDefault();

            // console.log(dataSet);
            // dataSet = [];
            // $('#data-table tr').has('td').each(function() {
            //     var arrayItem = [];
            //     $('td', $(this)).each(function(index, item) {
            //         arrayItem[index] = $(item).html();
            //     });
            //     dataSet.push(arrayItem);
            // });
            $('#data-table td').each(function (){$(this).html($(this).text())});
            tbl
                .rows()
                .invalidate('dom')
                .draw();

            console.log(dataSet);
        } );


        $('#selable').click(function() {
            $('#data-table').selectable({filter: ".movable", cancel: ".handle"});
        });

        $('#notselable').click(function() {
            $('#data-table').selectable("destroy");
        });


        //$('#data-table').selectable({cancel: ".handle"});
        $('#data-table').selectable({filter: ".movable", cancel: ".handle"});
        $('#data-table').selectable("destroy");
        $('#data-table td').addClass('dropable');
        tbl.on('mouseup', function(e){
            var text = window.getSelection();
            // check if anything is actually highlighted
            if(text.toString()) {
                // we've got a highlight, now do your stuff here
                var range = window.getSelection().getRangeAt(0);
                var newNode = $('<div></div>').addClass('movable').addClass( "ui-corner-all")[0];
                range.surroundContents(newNode);
                var nnNode = range.extractContents().firstElementChild;
                // console.log(nnNode);
                $(nnNode).prepend( "<div class='handle'><span class='ui-icon ui-icon-carat-2-n-s'></span></div>" );
                //$(nnNode).selectable({cancel: ".handle"});
                range.insertNode(nnNode);
                // $(newNode).prepend( "<div class='handle'><span class='ui-icon ui-icon-carat-2-n-s'></span></div>" ).selectable({cancel: ".handle"});
                window.getSelection().empty();
                tbl.sortable("refresh");
                //tbl.selectable("refresh");
            }
        });
        // tbl.sortable({ handle: ".handle" });
    } );


});
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});