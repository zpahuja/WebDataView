function modifyDOM() {
    /*
     * return an Object domObj
     * idMapDomSerial: mapping ids to serialized DOM elements
     * idMapDomObj: mapping ids to DOM elements
     * domSerialMapId: map hashed serialized DOM elements to ids
     */
    var elems = document.body.getElementsByTagName("*");
    var idMapDomSerial = {};
    var idMapDomObj = {};
    var domSerialMapId = {};
    for(var id=0; id < elems.length; id++) {
        domSerial = {};
        domSerial['id'] = id;
        domSerial['tag'] = elems[id].tagName;
        domSerial["class"] = elems[id].className;
        domSerial['bottom'] = elems[id].getBoundingClientRect().bottom;
        domSerial['left'] = elems[id].getBoundingClientRect().left;
        domSerial['top'] = elems[id].getBoundingClientRect().top;
        domSerial['right'] = elems[id].getBoundingClientRect().right;
        domSerial['height'] = elems[id].getBoundingClientRect().height;
        domSerial['width'] = elems[id].getBoundingClientRect().width;
        domSerial['x'] = elems[id].getBoundingClientRect().x;
        domSerial['y'] = elems[id].getBoundingClientRect().y;
        domSerial['parent'] = -1;
        // if(elems[id].tagName == 'P' ||
        //     elems[id].tagName == 'H1' ||
        //     elems[id].tagName == 'H2' ||
        //     elems[id].tagName == 'H3' ||
        //     elems[id].tagName == 'H4' ||
        //     elems[id].tagName == 'H5' ||
        //     elems[id].tagName == 'H6')
        domSerial['text'] = elems[id].textContent;
        // if(elems[id].tagName == "SPAN")
        //   console.log(elems[id].textContent);
        idMapDomSerial[id] = domSerial;
        idMapDomObj[id] = elems[id];
        var domSerialHash = [domSerial['bottom'], domSerial['left'], domSerial['top'], domSerial['right']];
        domSerialMapId[domSerialHash] = id;
    }

    for(var id=0; id<elems.length; id++) {
        var parent = elems[id].parentElement;
        var parentHash = [];
        parentHash = parentHash.concat(parent.getBoundingClientRect().bottom);
        parentHash = parentHash.concat(parent.getBoundingClientRect().left);
        parentHash = parentHash.concat(parent.getBoundingClientRect().top);
        parentHash = parentHash.concat(parent.getBoundingClientRect().right);
        parentId = domSerialMapId[parentHash];
        if(parentId >= 0)
            idMapDomSerial[id]['parent'] = parentId;
    }

    var domObj = {};
    domObj['idMapDomSerial'] = idMapDomSerial;
    domObj['idMapDomObj'] = idMapDomObj;
    domObj['domSerialMapId'] = domSerialMapId;

    return domObj;
}