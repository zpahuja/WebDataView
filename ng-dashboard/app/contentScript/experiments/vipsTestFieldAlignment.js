console.log("VIPS Test Field Alignment");

if (typeof showBorderForDomSelection != 'function') {
    showBorderForDomSelection = function(){
        event.preventDefault();
        event.target.style.border = "2px solid #FF0000";
    }
}

if (typeof hideBorderForDomSelection != 'function') {
    hideBorderForDomSelection = function (){
        event.preventDefault();
        event.target.style.border = "";
    }
}

document.addEventListener("mouseover", showBorderForDomSelection);
document.addEventListener("mouseout", hideBorderForDomSelection);

fields = []
field = []
fields_counter = 0
var CSS_COLOR_NAMES = ["Blue","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

for (var i = 0; i < globalBlocks.length; i++) {
    var box = globalBlocks[i]['-att-box'];
    box.title = i.toString().concat(" : ", globalBlocks[i]['-vips-id']);
    box.addEventListener('click', function(e){
        e.preventDefault();
        var idx = (this.title).match(/(\d*)\s:/);
        var id = globalBlocks[parseInt(idx, 10)]['-vips-id'];

        var next = false;
        // if parent replace parent
        for (var j = 0; j < field.length; j++) {
            var tmpidx = parseInt(field[j], 10);
            var tmpid = globalBlocks[tmpidx]['-vips-id'];
            if(id.localeCompare(tmpid) == 0) {
                next = true;
            }
            if (id.indexOf(tmpid) != -1) {
                field[j] = tmpidx;
                var prevbox = globalBlocks[tmpidx]['-att-box'];
                prevbox.style.border = "";
                this.style.border = "2px solid ".concat(CSS_COLOR_NAMES[fields_counter*3]);
                next = true;
                console.log(id, tmpid, "child replaces parent");
            }
            // if child already there, then move on
            if (tmpid.indexOf(id) != -1) {
                next = true;
                console.log(id, tmpid, "child already present");
            }
        }
        if(idx && !next) {
            field.push(idx[1]);
            this.style.border = "2px solid ".concat(CSS_COLOR_NAMES[fields_counter*3]);
        }
    });
}

var body = document.getElementsByTagName("body")[0];
var test_fields = document.createElement("div");
test_fields.style.position = "fixed";
test_fields.style.bottom = "0px";
test_fields.style.right = "0px";
body.appendChild(test_fields);

// Add buttons for new field and done
var button2 = document.createElement("button");
button2.innerHTML = "Done";
button2.style.position = "relative";
button2.style.backgroundColor = "#00FF00"; /* Red */
button2.style.color = "white";
button2.style.padding = "15px 32px";
button2.style.textAlign = "center";
button2.style.display = "inline-block";
button2.style.fontSize = "16px";

// Add buttons for new field and done
var button = document.createElement("button");
button.innerHTML = "Add Field";
button.style.position = "relative";
button.style.backgroundColor = "#4CAF50"; /* Green */
button.style.color = "white";
button.style.padding = "15px 32px";
button.style.textAlign = "center";
button.style.display = "inline-block";
button.style.fontSize = "16px";

test_fields.appendChild(button);
test_fields.appendChild(button2);

button.addEventListener ("click", function() {
    fields.push(field);
    field = [];
    fields_counter++;
});

button2.addEventListener ("click", function() {
    fields.push(field);
    field = [];
    fields_counter++;
    console.log(fields); // save as json
    document.removeEventListener("mouseover", showBorderForDomSelection);
    document.removeEventListener("mouseout", hideBorderForDomSelection);
    button.style.display = "none"
    button2.style.display = "none"
});