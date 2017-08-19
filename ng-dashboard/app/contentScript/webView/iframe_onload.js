console.log('iframe onload script ran');
$('body').ready(function() {
    console.log(Boundary.findBox('#webdataview-test').get(0));
    addHandle(Boundary.findBox('#webdataview-test').get(0), window);
});
