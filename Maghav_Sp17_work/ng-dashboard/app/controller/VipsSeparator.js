function VipsParser(width,height) {

    var _vipsBlocks = null;
    var _visualBlocks = null; //visual block list
    var _horizontalSeparators = null; //horizontal separator list
    var _verticalSeparators = null; // vertical separator list

    var _width = width;
    var _height = height;
    var _cleanSeparatorsTreshold = 0;


    this.parse = function() {
        if(_pageWidth && _pageHeight) {
            _vipsBlocks = new VipsBlock(); 
            _visualBlocksCount = 0;
            constructVipsBlockTree(document.body,_vipsBlocks);
            divideVipsBlockTree(_vipsBlocks);
            getVisualBlocksCount(_vipsBlocks);
        }
        else {
            console.log("Page Viewport is not defined");
        }
    }

    var findVisualBlocks = function(vipsBlock,list) {
        if (vipsBlock.isVisualBlock() && !isTextNode(vipsBlock.getBox()))
            list.push(vipsBlock.getBox());
        for (var i = 0; i < vipsBlock.getChildren().length; i++) {
            findVisualBlocks(vipsBlock.getChildren()[i], list);
        }
    }
}