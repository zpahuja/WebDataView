console.log("VIPS Highlight Sorted");
var vips = new VipsAPI();
globalBlocks = vips.getVisualBlockList();

// array of colors
color_palette_orig = [[51,34,136], [136, 204, 238], [68, 170, 153], [17, 119, 51], [153, 153, 51], [221, 204, 119], [102, 17, 0], [204, 102, 119], [136, 34, 85], [170, 68, 153]]
color_palette = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
colorIndex = 0;

// dictionary
vipsid_to_block_index = mapVipsIdToGlobalBlocksIndex();

/*
Some Notes to self
------------------
 // sort VIPS array by property
-vips-startX
-vips-endX
-vips-startY
-vips-endY

.sort(sortGlobalBlockIndicesByAttr('-vips-startY'));

Start with root
    Sort all its children by x
Group them by the same dimensions
Color code groups
Repeat for children in BFS manner
*/

var root = "1";
var children = getChildren(root);
// sort children by start X
sortedChildren = children.sort(sortGlobalBlockIndicesByAttr());
console.log(sortedChildren);
// Group children by same dimensions
groups = groupSortedIndices(sortedChildren);
console.log(groups);
// Color code the groups
for (var i = 0; i < groups.length; i++) {
    colorCode(groups[i], 'default', 'color background', 'none');
}

/*
 * function to group sorted array of global block indices by same dimensions
 */
function groupSortedIndices(indices) {
    var groups = [];
    var idx = indices[0];
    var group = [idx];
    var block_width = globalBlocks[idx]['-att-clientWidth'];
    var block_height = globalBlocks[idx]['-att-clientHeight'];
    var group_width = block_width;
    var group_height = block_height;

    for (var i =1; i < indices.length; i++) {
        idx = indices[i];
        block_width = globalBlocks[idx]['-att-clientWidth'];
        block_height = globalBlocks[idx]['-att-clientHeight'];
        if (compare(group_width, block_width) && compare(group_height, block_height)) {
            group.push(idx);
        }
        else {
            groups.push(group);
            group = [idx];
            group_width = block_width;
            group_height = block_height;
        }
    }

    return groups;
}

/*
 * function that maps rgb array and opacity parameters to RGBA string
 */
function toRGBA(rgb, opacity=1.0) {
    return "rgba(".concat(rgb[0], ", ", rgb[1], ", ", rgb[2], ", ", opacity, ")");
}

/*
 * function that compares if b is within [1-epsilon, 1+epsilon] of a
 */
function compare(a, b, epsilon=0.1) {
    var lowerbound = a * (1-epsilon);
    var upperbound = a * (1+epsilon);
    return lowerbound <= b && b <= upperbound;
}

/*
 * function to color code an global block or an array of blocks specified by index
 * default color is next color in palette unless specified
 * TODO: default style is border color unless specified as 'underline' or 'highlight text' or 'color background'
 * TODO: default mouseEvent is 'none' unless 'onHover' or 'onClick' specified
 */
function colorCode(block, color='default', style='border', mouseEvent='none') {
    var col = (color === 'default') ? color_palette[colorIndex++] : color;
    if (!col)
        console.log("Ran out of colors in color palette");

    if (Array.isArray(block)) {
        for (var i = 0; i < block.length; i++) {
            var box = globalBlocks[block[i]]['-att-box'];
            if (style === 'color background') {
                colorBackground(box, col);
                console.log(col);
            }
            else {
                box.style.border = "1px solid " + col;
            }
            box.title = globalBlocks[block[i]]['-att-clientWidth'].toString().concat(" x ", globalBlocks[block[i]]['-att-clientHeight'].toString());
        }
    }
    else {
        var box = globalBlocks[block]['-att-box'];
        if (style === 'color background') {
            colorBackground(box, col);
        }
        else {
            box.style.border = col;
        }
    }
}

/*
 * function that returns dictionary of vips id (key) -> global block index (value)
 */
function mapVipsIdToGlobalBlocksIndex() {
    id_to_index_map = [];
    for (var i = 0; i < globalBlocks.length; i++) {
        var vipsid = globalBlocks[i]['-vips-id'];
        id_to_index_map[vipsid] = i;
    }
    return id_to_index_map;
}

/*
 * getChildren in VIPS tree of a block index (int) or vipsId (string) input
 * default return attr is global block index
 * optional return attr can be specified as 'index' (int) or 'id' (string)
 */
function getChildren(i, attr = 'index') {
    var id = (typeof i === "number") ? globalBlocks[i]['-vips-id'] : i;
    id = id.concat('-');
    var children = [];
    var counter = 1;

    while(true) {
        var temp_id = id.concat(counter.toString());
        var idx = vipsid_to_block_index[temp_id];
        if(!idx && idx != 0)
            break;
        if(attr === 'id')
            children.push(temp_id);
        if(attr === 'index')
            children.push(idx);
        counter++;
    }
    return children;
}

/*
 * getParent in VIPS tree of a block by index (int) or vipsId (string) input
 * default return attr is global block index
 * optional return attr can be specified as 'index' (int) or 'id' (string)
 */
function getParent(i, attr = 'index') {
    var id = typeof i === "number" ? globalBlocks[i]['-vips-id'] : i;
    var extractParentIdPattern = /((\d*-)*\d*)-\d+$/g;
    var parentIdMatch = id.match(extractParentIdPattern);
    if(parentIdMatch) {
        var parentId = parentIdMatch[1];
        if(attr === 'id')
            return parentId;
        if(attr === 'index')
            return vipsid_to_block_index[parentId];
    }
    return false;
}

/*
 * Sort array of globalBlock indices by attr
 * default attr is -vips-startX
 * attribue must be a numerical value
 */
function sortGlobalBlockIndicesByAttr(attr = '-vips-startX') {
    return function(a, b) {
        return globalBlocks[a][attr] - globalBlocks[b][attr];
    }
}

/*
 * function that colors background of block
 */
function colorBackground(box, color, opacity=0.3) {
    box.style.backgroundImage = "url(https://upload.wikimedia.org/wikipedia/en/4/48/Blank.JPG)";
    box.style.backgroundRepeat = "repeat";
    box.style.boxShadow = "inset 0 0 0 1000px " + getBgColor(color, opacity);
}

function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA('red')  # [255, 0, 0, 255]
    // colorToRGBA('#f00') # [255, 0, 0, 255]
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.style.visibility = "hidden";
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    return ('0'+num.toString(16)).slice(-2);
}

function colorToHex(color) {
    // Convert any CSS color to a hex representation
    // Examples:
    // colorToHex('red')            # '#ff0000'
    // colorToHex('rgb(255, 0, 0)') # '#ff0000'
    var rgba, hex;
    rgba = colorToRGBA(color);
    hex = [0,1,2].map(
        function(idx) { return byteToHex(rgba[idx]); }
    ).join('');
    return "#"+hex;
}

function hex2rgba_convert(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
}

function getBgColor(color, opacity) {
    return hex2rgba_convert(colorToHex(color), opacity);
}