/**
 * Created by longpham on 7/6/17.
 */

chrome.storage.local.get(function(result){console.log(result)});
chrome.storage.local.get(function(res){
    dataSet = res.dataSet;
    fieldNames = res.fieldNames;
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

    $(document).ready(function() {
        var tbl = $('#data-table').DataTable( {
            data: dataSet,
            columns: fieldNames,
            scrollX: "100%",
            scrollY: "600px",
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
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
        tbl.on('mouseup', function(e){
            var text = window.getSelection();
            // check if anything is actually highlighted
            if(text.toString()) {
                // we've got a highlight, now do your stuff here
                var range = window.getSelection().getRangeAt(0);
                var newNode = $('<div></div>').addClass('movable')[0];
                range.surroundContents(newNode);
                window.getSelection().empty();
            }
        })
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