/**
 * Created by longpham on 7/6/17.
 */
console.log("ha ha ha ha");
chrome.storage.local.get(function(result){console.log(result)});
chrome.storage.local.get(function(res){
    dataSet = res.dataSet;
    fieldNames = res.fieldNames;
    $(document).ready(function() {
        $('#data-table').DataTable( {
            data: dataSet,
            columns: fieldNames,
            scrollX: "100%",
            scrollY: "600px"
        } );
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