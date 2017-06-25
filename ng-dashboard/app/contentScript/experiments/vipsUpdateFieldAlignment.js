console.log("Update Field Alignment");

firstClick = null;
firstClickArr = [];

if (typeof showBorderForDomSelection != 'function') {
    showBorderForDomSelection = function(){
        event.preventDefault();
        if(firstClick) {
            mouseOverId = parseInt(event.target.title);
            mouseOverClusterId = id2cluster[mouseOverId];
            if(clusters[mouseOverClusterId]) {
                for(var i = 0; i < clusters[mouseOverClusterId].length; i++) {
                    var index = clusters[mouseOverClusterId][i];
                    if(index != firstClick) {
                        var boxes = globalBlocks[index]['-att-box'];
                        boxes.style.border = "1px solid " + CSS_COLOR_NAMES[mouseOverClusterId];
                    }
                }
            }
        }
        else {
            event.target.style.border = "1px solid #FF0000";
        }
    }
}

if (typeof hideBorderForDomSelection != 'function') {
    hideBorderForDomSelection = function (){
        event.preventDefault();
        mouseOverId = parseInt(event.target.title);
        mouseOverClusterId = id2cluster[mouseOverId];

        if(firstClick) {
            if(clusters[mouseOverClusterId]) {
                for (var i = 0; i < clusters[mouseOverClusterId].length; i++) {
                    var index = clusters[mouseOverClusterId][i];
                    if (index != firstClick) {
                        var boxes = globalBlocks[index]['-att-box'];
                        boxes.style.border = "1px dotted " + CSS_COLOR_NAMES[mouseOverClusterId];
                    }
                }
            }
        }
        else {
            event.target.style.border = "1px dotted " + CSS_COLOR_NAMES[mouseOverClusterId];
        }
    }
}

document.addEventListener("mouseover", showBorderForDomSelection);
document.addEventListener("mouseout", hideBorderForDomSelection);

document.addEventListener("click", function(e) {
    e.preventDefault();
    var clickId = parseInt(e.target.title);
    console.log(clickId);
    if(!firstClick) {
        firstClick = clickId;
        var box = globalBlocks[firstClick]['-att-box'];
        box.style.border = "2px solid #FF0000";
    }
    else {
        clusterId = id2cluster[clickId];

        // change cluster of firstClick to clusterID and its color
        var box = globalBlocks[firstClick]['-att-box'];
        // box.style.backgroundColor = getBgColor(CSS_COLOR_NAMES[clusterId]);
        box.style.backgroundImage = "url(https://upload.wikimedia.org/wikipedia/en/4/48/Blank.JPG)";
        box.style.backgroundRepeat = "repeat";
        box.style.boxShadow = "inset 0 0 0 1000px " + getBgColor(CSS_COLOR_NAMES[clusterId]);
        box.style.border = "1px dotted " + CSS_COLOR_NAMES[clusterId];

        // remove from previous cluster

        var origCluster = id2cluster[firstClick];
        var indexOfFirstClickInCluster = clusters[origCluster].indexOf(firstClick);
        if(indexOfFirstClickInCluster > -1) {
            clusters[origCluster].splice(indexOfFirstClickInCluster, 1);
        }

        //  add to new cluster
        id2cluster[firstClick] = clusterId;

        if(clusters[clusterId]) {
            // push first click to new cluster
            clusters[clusterId].push(firstClick);

            // remove mouseOver highlights on second cluster
            for (var i = 0; i < clusters[clusterId].length; i++) {
                var index2 = clusters[clusterId][i];
                var boxes2 = globalBlocks[index2]['-att-box'];
                boxes2.style.border = "1px dotted " + CSS_COLOR_NAMES[clusterId];
            }
        }

        // reset firstClick
        firstClick = null;
    }
});

/* Helper footer div */
console.log("Creating footer");
var body = document.getElementsByTagName("body")[0];
var ft = document.createElement("div");
ft.style.position = "fixed";
ft.style.width = "100%";
ft.style.bottom = "0px";
ft.style.backgroundColor = "white";
ft.style.zIndex = "10000";
ft.removeEventListener("mouseover", showBorderForDomSelection);

// Add buttons for new field and done
var suggestclusters = document.createElement("button");
suggestclusters.innerHTML = "Select similar fields";
suggestclusters.style.color = "black";
suggestclusters.style.backgroundColor = "white";
suggestclusters.style.marginLeft = "20%";
suggestclusters.style.textAlign = "center";
suggestclusters.style.display = "inline-block";
suggestclusters.style.fontSize = "20px";
suggestclusters.style.padding = "5px";
suggestclusters.style.border = "none";
/*
var fontawsm = document.createElement("I");
fontawsm.className += "fa fa-object-group";
suggestclusters.appendChild(fontawsm);
*/
/*
ft.removeEventListener("mouseover", showBorderForDomSelection);
suggestclusters.removeEventListener("mouseover", showBorderForDomSelection);
ft.addEventListener("mouseout", hideBorderForDomSelection2);
suggestclusters.addEventListener("mouseout", hideBorderForDomSelection2);
*/

ft.appendChild(suggestclusters);
body.appendChild(ft);

ft.addEventListener ("click", function() {
    //event.target.style.border = ""
});

suggestclusters.addEventListener ("click", function() {
    //event.target.style.border = ""
    if(firstClick) {
        firstClickArr = [];
        firstClickArr.push(firstClick);
        var clusterId = id2cluster[firstClick];
        for(var i = 0; i < clusters[clusterId].length; i++) {
            var box = globalBlocks[i]['-att-box'];
            box.style.border = "2px solid #FF0000";
            firstClickArr.push(i);
        }
        console.log(firstClickArr);
    }
    else{
        alert("Please select a field first");
    }
});


/*
 else {
 clusterId = id2cluster[clickId];

 // change cluster of firstClick to clusterID and its color
 var box = globalBlocks[firstClick]['-att-box'];
 // box.style.backgroundColor = getBgColor(CSS_COLOR_NAMES[clusterId]);
 box.style.backgroundImage = "url(https://upload.wikimedia.org/wikipedia/en/4/48/Blank.JPG)";
 box.style.backgroundRepeat = "repeat";
 box.style.boxShadow = "inset 0 0 0 1000px " + getBgColor(CSS_COLOR_NAMES[clusterId]);
 box.style.border = "1px dotted " + CSS_COLOR_NAMES[clusterId];

 // remove from previous cluster

 var origCluster = id2cluster[firstClick];
 var indexOfFirstClickInCluster = clusters[origCluster].indexOf(firstClick);
 if(indexOfFirstClickInCluster > -1) {
 clusters[origCluster].splice(indexOfFirstClickInCluster, 1);
 }

 //  add to new cluster
 id2cluster[firstClick] = clusterId;

 if(clusters[clusterId]) {
 // push first click to new cluster
 clusters[clusterId].push(firstClick);

 // remove mouseOver highlights on second cluster
 for (var i = 0; i < clusters[clusterId].length; i++) {
 var index2 = clusters[clusterId][i];
 var boxes2 = globalBlocks[index2]['-att-box'];
 boxes2.style.border = "1px dotted " + CSS_COLOR_NAMES[clusterId];
 }
 }

 // reset firstClick
 firstClick = null;
 }
 */