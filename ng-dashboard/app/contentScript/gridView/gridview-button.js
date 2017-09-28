// listen to table view click
// very prone to error because assynchronization issue
console.log('assigning listener for gridview button');
setTimeout(function(){ console.log($('#grid-view')); $('#grid-view').click( function() {
    console.log('sending command trigger-gridview to the extension...');
    chrome.runtime.sendMessage({command: "trigger-gridview"}, function(response) {
        console.log('response: ' + response);
    });
});}, 300);
