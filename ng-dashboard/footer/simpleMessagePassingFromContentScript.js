chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        // if (request.greeting == "hello")
        //     sendResponse({farewell: "goodbye"});
        tmp = JSON.parse(request.greeting);
        console.log("Message received: " + tmp);
        // var clusters = []
        // clusters.push($(tmp['fields']['title']));
        // clusters.push($(tmp['fields']['price']));
        // console.log(clusters);
        // var clusters = []
        // clusters.push($('div.tile-content > div.search-result-product-title div'));
        // clusters.push($('div.search-result-listview-item div.price-main-block span.Price-group'));

        if (tmp['boxes'].length === 0) {
            alert('Web Data View: We found no applicable rules here!');
        }

        console.log(tmp['fields']);
        fields = Object.keys(tmp['fields']);
        // console.log(fieldNames);
        // console.log(fieldNames[0]);
        // console.log(fieldNames.length);
        dataSet = [];
        console.log(fields);
        if (fields[0] === 'email') {
            console.log('query3 is processed');
            var row = []
            for (var j = 0; j < fields.length; j++) {
                var xpath = tmp['fields'][fields[j]][0];
                console.log(xpath);
                var item = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                row.push($(item).text());
            }
            dataSet.push(row);
        } else {
            for (var i = 0; i < tmp['boxes'].length; i++) {
                box_xpath = tmp['boxes'][i];
                // console.log(box_xpath);
                box = document.evaluate(box_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                // console.log(box);
                var row = [];
                for (var j = 0; j < fields.length; j++) {
                    // console.log($(box));
                    // console.log(fieldNames);
                    // console.log(j);
                    // console.log(fieldNames[j]);
                    // console.log(tmp['fields'][fieldNames[j]]);
                    // console.log($(box).find(tmp['fields'][fieldNames[j]]));
                    item = $(box).find(tmp['fields'][fields[j]])[0]
                    row.push($(item).text());
                }
                dataSet.push(row);
            }
        }

        console.log(dataSet);

        fieldNames = []
        for (var i = 0; i < fields.length; i++) {
            fieldNames.push({'title': fields[i]});
        }

        console.log(fieldNames);

        chrome.storage.local.set({"dataSet": dataSet});
        chrome.storage.local.set({"fieldNames": fieldNames});

        // chrome.runtime.sendMessage({"dataSet": dataSet, "fieldNames": fieldNames}, function(response) {
        //     console.log(response.farewell);
        // });

        $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.12/datatables.css"/>');

        $(document).ready(function() {
            $('#data-table').DataTable( {
                data: dataSet,
                columns: fieldNames,
                scrollX: "100%",
                scrollY: "800px"
            } );
        } );
    });

// var clusters = []
// clusters.push($('div.tile-content > div.search-result-product-title div'));
// clusters.push($('div.search-result-listview-item div.price-main-block span.Price-group'));
//
// fieldNames = [];
// numOfInstances = 0;
// for (var i = 0; i < clusters.length; i++) {
//     fieldNames.push({title: "Field " + i});
//     if (numOfInstances < clusters[i].length) {
//         numOfInstances = clusters[i].length;
//     }
// }
//
// dataSet = [];
// for (var j = 0; j < numOfInstances; j++) {
//     dataSet[j] = Array.apply(null, Array(clusters.length)).map(function () {return ""});
// }
//
// for (var i = 0; i < clusters.length; i++) {
//     for (var j = 0; j < clusters[i].length; j++) {
//         console.log(clusters[i][j]);
//         dataSet[j][i]=$(clusters[i][j]).text();
//     }
// }
//
// chrome.storage.local.set({"dataSet": dataSet});
// chrome.storage.local.set({"fieldNames": fieldNames});
//
// $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.12/datatables.css"/>');
//
// $(document).ready(function() {
//     $('#data-table').DataTable( {
//         data: dataSet,
//         columns: fieldNames,
//         scrollX: "100%",
//         scrollY: "800px"
//     } );
// } );