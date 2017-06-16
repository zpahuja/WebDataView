console.log("VIPS Export All Including Children");
var globalBlocks = _global_visualblock_list;
var blocks_out = [];
var hseparators_out = [];
var vseparators_out = [];
var visualData = {};
visualData['blocks'] = blocks_out;
visualData['hseparators'] = hseparators_out;
visualData['vseparators'] = vseparators_out;

for (var i = 0; i < globalBlocks.length; i++) {
    var b = globalBlocks[i];
    var tmp = {};
    blocks_out.push(tmp);
    tmp['-vips-id'] = b.getId();
    tmp['-vips-degree-of-coherence'] = b.getDoC();
    tmp['-vips-startX'] = b.getStartX();
    tmp['-vips-endX'] = b.getEndX();
    tmp['-vips-startY'] = b.getStartY();
    tmp['-vips-endY'] = b.getEndY();
    tmp['-att-box'] = b.getBox();
    console.log(b.getBox());
    for (var x in b.getBox()) {
        console.log(x);
        console.log(b.getBox()[x]);
    }
    break;
    //add more vips visual blocks' properties here, e.g., degree of coherence,
    //list all attributes of the current nodes. It does not contain attributes of its child nodes,
    // which may be a serious missing but students can get them manually by using the -vips-blocks-box property
    var box = b.getBox();
    for (var x in box) {
        if ((typeof x !== 'function') && (typeof x !== 'object') && (x !== 'style')) {
            try {
                tmp['-att-' + x] = box[x];
            } catch (err) {
                if (_debug == 1) {
                    console.log(err);
                }
            }

        }
    }

    //list all css styles
    var cssObj = window.getComputedStyle(b.getBox(), null)
    for (var j = 0; j < cssObj.length; j++) {
        var cssObjProp = cssObj.item(j);
        tmp['-style-' + cssObjProp] = cssObj.getPropertyValue(cssObjProp);
    }
}

//add horizontal separators here
hs = _global_horizontalseparator_list;
for (var i = 0; i < hs.length; i++) {
    var h = hs[i];
    var tmp = {};
    hseparators_out.push(tmp);
    tmp['vips-hseparator-startPoint'] = h.startPoint;
    tmp['vips-hseparator-endPoint'] = h.endPoint;
    tmp['vips-hseparator-weight'] = h.weight;
}

// add vertical separators here
// tmp['vips-vseparator-xxxxx'] = '';
vs = _global_verticalseparator_list;
for (var i = 0; i < vs.length; i++) {
    var v = vs[i];
    var tmp = {};
    vseparators_out.push(tmp);
    tmp['vips-vseparator-startPoint'] = v.startPoint;
    tmp['vips-vseparator-endPoint'] = v.endPoint;
    tmp['vips-vseparator-weight'] = v.weight;
}

// export to JSON and download
var strout = JSON.stringify(visualData);
//filename = 'wdv_' + encodeURI(document.title) + '.json';
//console.log(strout);
//var a         = document.createElement('a');
//a.href        = 'data:' +  strout;
//a.target      = '_blank';
//a.download    = filename;
//document.body.appendChild(a);
//a.click();
filename = 'vips_' + window.location.host + '.json';
var blob = new Blob([strout], {type: "text/json;charset=utf-8"});
// saveAs(blob, filename);