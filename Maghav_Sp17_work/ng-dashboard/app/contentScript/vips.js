//Global variables for vips
var _global_visualstructure_list = [];
var _global_visualblock_list = [];
var _global_horizontalseparator_list = [];
var _global_verticalseparator_list = [];

var _debug = 0;

// Run script when click is detected
VipsMain();

function VipsAPI() {
    
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
        //add more vips visual blocks' properties here, e.g., degree of coherence, 
        //list all attributes of the current nodes. It does not contain attributes of its child nodes, 
        // which may be a serious missing but students can get them manually by using the -vips-blocks-box property
        var box = b.getBox();
        for (var x in box){
            if ((typeof x !== 'function') && (typeof x !== 'object') && (x !== 'style')) {
                try {
                    tmp['-att-' + x] = box[x];
                } catch(err) {
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
    
    this.getVisualBlockList = function() {
        return blocks_out;
    }
    
    this.getVisualBlockTree = function() {
        var tree = new TreeModel();
        var root = tree.parse({
            children: [],
            data: {'-vips-id': '1'}
        });
        var bs = blocks_out.sort(function (a,b) {
            if (a['-vips-id'].length - b['-vips-id'].length != 0)
                return a['-vips-id'].length - b['-vips-id'].length;
            else return a['-vips-id'].localeCompare(b['-vips-id']);
        });
        for (var i = 0; i < bs.length; i++) {
            var b = bs[i];
            var id = b['-vips-id'];
            var parent_id = id.substring(0, id.lastIndexOf('-'));
            var parent = root.first(function (node) {
                return node.model.data['-vips-id'] === parent_id;
            });
            var cur = tree.parse({
                children: [],
                data: b
            });
            parent.addChild(cur);
        }
//      root.walk(function (node) {
//          console.log(node.model.data['-vips-id']);
//      });
        return root;
    }
    this.getVisualBlockTree();
//
//    this.getHorizontalSeparatorList = function() {
//        return hseparators_out;
//    }
//
//    this.getVerticalSeparatorList = function() {
//        return vseparators_out;
//    }
    
    this.getVisualData = function() {
        return visualData;
    }
    
}

// Function vips_wrapper is the wrapper function for vips, called by addEventListener when click is detected
function VipsMain(){
    //console.log("Beginning to run VIPS!");
    var _pDoC = 8;
    var numberOfIterations = 10;
    var pageWidth = Math.max($(document).width(), $(window).width());
    var pageHeight = Math.max($(document).height(), $(window).height());
    var sizeTresholdWidth = 400;
    var sizeTresholdHeight = 400;

    var vips = new VipsParser();
    var constructor = new VisualStructureConstructor();
    constructor.setPDoC(_pDoC);

    // Iterations to find nested blocks
    for (var iterationNumber = 1; iterationNumber < numberOfIterations+1; iterationNumber++) {
        if (_debug == 1) {
            console.log("#######################################################################");
            console.log("Interation number:", iterationNumber);
        }
        var detector = new VipsSeparator(pageWidth,pageHeight);

        // Set the size threshold of blocks
        vips.setSizeTresholdWidth(sizeTresholdWidth);
        vips.setSizeTresholdHeight(sizeTresholdHeight);

        // Begin parsing
        vips.parse();

        // Get block count
        if (_debug == 1) {
            console.log("Total blocks found: ", vips.getCount());
        }
        // Get list of visual blocks
        var blocks = vips.getVisualBlocks();
        if (_debug == 1) {
            console.log(blocks);
        }
        // Get top level block
        var test = vips.getVipsBlocks();

        // First iteration run
        if (iterationNumber == 1) {
            detector.setVipsBlock(test);
            detector.fillPool();
            detector.setCleanUpSeparators(0);
            detector.detectHorizontalSeparators();
            detector.detectVerticalSeparators();
            constructor.setVipsBlocks(test);
            //console.log(detector.getHorizontalSeparators());
        }

        // Update existing blocks if not the first run
        else {
            test = vips.getVipsBlocks();
            constructor.setVipsBlocks(test);
        }

        // Construct visual block tree
        //constructor.constructVisualStructure();
        constructor.construct_vs();

        // var sss = constructor.getVisualStructure().getChildrenVisualStructures();
        // // Output block ID for testing
        // for (var n = 0; n < sss.length; n++) {
        //     //console.log(sss[n].getId());
        // }

        // Prepare tresholds for next iteration
        if (iterationNumber <= 5 )
        {
            sizeTresholdHeight -= 50;
            sizeTresholdWidth -= 50;

        }
        if (iterationNumber == 6)
        {
            sizeTresholdHeight = 100;
            sizeTresholdWidth = 100;
        }
        if (iterationNumber == 7)
        {
            sizeTresholdHeight = 80;
            sizeTresholdWidth = 80;
        }
        if (iterationNumber == 8)
        {
            sizeTresholdHeight = 40;
            sizeTresholdWidth = 10;
        }
        if (iterationNumber == 9)
        {
            sizeTresholdHeight = 1;
            sizeTresholdWidth = 1;
        }
    }

    // Assigning global values for api
    _global_visualstructure_list = constructor.getAllListVisualStructures();
    var temp_glist = [];
    for (var i = 0; i < _global_visualstructure_list.length; i++) {
        for (var j = 0; j < _global_visualstructure_list[i].getChildrenVisualStructures().length; j++) {
            temp_glist.push(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0]);
        }
    }

    var detect = new VipsSeparator(pageWidth,pageHeight);

    //console.log(temp_glist);
    detect.setVisualBlockList(temp_glist);
    detect.detectHorizontalSeparators();
    detect.detectVerticalSeparators();
    constructor.setHorizontalSeparator(detect.getHorizontalSeparators());
    constructor.setVerticalSeparator(detect.getVerticalSeparators());
    constructor.normalizeSeparatorsMinMax();

    _global_visualstructure_list = constructor.getAllListVisualStructures();
    for (var i = 0; i < _global_visualstructure_list.length; i++) {
        for (var j = 0; j < _global_visualstructure_list[i].getChildrenVisualStructures().length; j++) {
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setDoC(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getDoC());
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setId(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getId());
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setStartX(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getStartX());
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setEndX(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getEndX());
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setStartY(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getStartY());
            _global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].setEndY(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getEndY());

            _global_visualblock_list.push(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0]);
            //console.log(_global_visualstructure_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].getDoC());
        }
    }

    _global_horizontalseparator_list = detect.getHorizontalSeparators();
    _global_verticalseparator_list = detect.getVerticalSeparators();
}

//------------------------------------------------------
// Class for INDIVIDUAL VISUAL BLOCKS
function VipsBlock() {
    //rendered Box, that corresponds to DOM element
    var _box = null;
    //children of this node
    var _children = [];
    //node id
    var _id = 0;
    //node's Degree Of Coherence
    var _DoC = 0;

    //number of images in node
    var _containImg = 0;
    //if node is image
    var _isImg = false;
    //if node is visual block
    var _isVisualBlock = false;
    //if node contains table
    var _containTable = false;
    //number of paragraphs in node
    var _containP = 0;
    //if node was already divided
    var _alreadyDivided = false;
    //if node can be divided
    var _isDividable = true;

    var _bgColor = null;

    var _frameSourceIndex = 0;
    var _sourceIndex = 0;
    var _tmpSrcIndex = 0;
    var _order = 0;


    //length of text in node
    var _textLen = 0;
    //length of text in links in node
    var _linkTextLen = 0;

    var _startX = 0;
    var _startY = 0;
    var _endX = 0;
    var _endY = 0;

    // Function to confirm that this block is indeed a visual block
    this.setIsVisualBlock = function(isVisualBlock) {
        _isVisualBlock = isVisualBlock;
    }

    // Function to check if block is visual block
    this.isVisualBlock = function() {
        return _isVisualBlock;
    }

    var checkProperties = function() {
        checkIsImg();
        checkContainImg(this);
        checkContainTable(this);
        checkContainP(this);
        //***need work
    }

    var checkIsImg = function() {
    if (_box.nodeName == "IMG")
        _isImg = true;
    else
        _isImg = false;
    }

    var checkContainImg = function(vipsblock) {
        if(vipsblock.getBox().nodeName == "IMG") {
            vipsblock._isImg = true;
            this._containImg++;
        }

        for (var i = 0; i < vipsblock.getChildren().length; i++) {
            checkContainImg((vipsblock.getChildren())[i]);
        }
    }

    var checkContainTable = function(vipsblock) {
        if(this.getBox().nodeName == "TABLE") {
            this._containTable = true;
        }

        for (var i = 0; i < vipsblock.getChildren().length; i++) {
            checkContainTable((vipsblock.getChildren())[i]);
        }
    }

    var checkContainP = function(vipsblock) {
        if(vipsblock.getBox().nodeName == "P") {
            this._containP++;
        }

        for (var i = 0; i < vipsblock.getChildren().length; i++) {
            checkContainP((vipsblock.getChildren())[i]);
        }
    }

    this.addChild = function(child) {
        _children.push(child);
    }

    this.getChildren = function() {
        return _children;
    }

    this.setBox = function(box) {
        _box = box;
    }

    this.getBox = function() {
        return _box;
    }

    this.setId = function(id) {
        _id = id;
    }

    this.getId = function() {
        return _id;
    }

    this.setDoC = function(doc) {
        _DoC = doc;
    }

    this.getDoC = function() {
        return _DoC;
    }

    this.isDividable = function() {
        return _isDividable;
    }

    this.setIsDividable = function(isDividable) {
        _isDividable = isDividable;
    }

    this.isAlreadyDivided = function() {
        return _alreadyDivided;
    }

    this.setAlreadyDivided = function(alreadyDivided) {
        _alreadyDivided = alreadyDivided;
    }

    /**
     * Checks if block is image
     * @return True if block is image, otherwise false
     */
    this.isImg = function()
    {
        return _isImg;
    }

    /**
     * Checks if block contain images
     * @return Number of images
     */
    this.containImg = function()
    {
        return _containImg;
    }

    /**
     * Checks if block contains table
     * @return True if block contains table, otherwise false
     */
    this.containTable = function()
    {
        return _containTable;
    }

    /**
     * Gets number of paragraphs in block
     * @return Number of paragraphs
     */
    this.containP = function()
    {
        return _containP;
    }

    this.getBgColor = function() {
        if (this.getBox().nodeType == 3) {
            _bgColor = "white";
        }
        else {
            getComputedStyle(this.getBox()).getPropertyValue("background-color");
        }

        return _bgColor;
    }

    this.setStartY = function(sy) {
        _startY = sy;
    }

    this.setStartX = function(sx) {
        _startX = sx;
    }

    this.setEndY = function(ey) {
        _endY = ey;
    }

    this.setEndX = function(ex) {
        _endX = ex;
    }

    this.getStartY = function() {
        return _startY;
    }

    this.getStartX = function() {
        return _startX;
    }

    this.getEndY = function() {
        return _endY;
    }

    this.getEndX = function() {
        return _endX;
    }
}

//-----------------------------------------------------------------------
/**
 * Class that parses blocks on page and finds visual blocks. First step of VIPS 
 *
 *
 */
function VipsParser() {
    var _pageHeight = Math.max($(document).height(), $(window).height());
    var _pageWidth = Math.max($(document).width(), $(window).width());
    // Default value
    var _sizeTresholdHeight = 80;
    var _sizeTresholdWidth = 80;

    var _vipsBlocks = null;
    var _currentVipsBlock = null;
    var _tempVipsBlock = null;
    var _visualBlocksCount = 0;

    // Main function in VipsParser
    this.parse = function() {
        if(_pageWidth && _pageHeight) {
            _vipsBlocks = new VipsBlock(); 
            _visualBlocksCount = 0;
            constructVipsBlockTree(document.body,_vipsBlocks);
            divideVipsBlockTree(_vipsBlocks);
            getVisualBlocksCount(_vipsBlocks);
        }
        else {
            //console.log("Page Viewport is not defined");
        }
    }

    // Return the size threshold width
    this.getSizeTresholdWidth = function()
    {
        return _sizeTresholdWidth;
    }

    // Set the size threshold width
    this.setSizeTresholdWidth = function(sizeTresholdWidth)
    {
        _sizeTresholdWidth = sizeTresholdWidth;
    }

    // Return the size threshold height
    this.getSizeTresholdHeight = function()
    {
        return _sizeTresholdHeight;
    }

    // Set the size threshold height
    this.setSizeTresholdHeight = function(sizeTresholdHeight)
    {
        _sizeTresholdHeight = sizeTresholdHeight;
    }

    // Function to find the list of visual blocks, mainly called by getVisualBlocks()
    var findVisualBlocks = function(vipsBlock,list) {
        if (vipsBlock.isVisualBlock() && !isTextNode(vipsBlock.getBox()))
            list.push(vipsBlock.getBox());
        for (var i = 0; i < vipsBlock.getChildren().length; i++) {
            findVisualBlocks(vipsBlock.getChildren()[i], list);
        }
    }

    // Function to get the list of visual blocks outputted
    this.getVisualBlocks = function() {
        var list = [];
        findVisualBlocks(_vipsBlocks, list);
        return list;
    }

    // Function to get the top level block outputted
    this.getVipsBlocks = function() {
        return _vipsBlocks;
    }

    // Helper function to check if element is a text node or not
    var isTextNode = function(el) {
        if (el.nodeType == 3) {
            return true;
        }
        else {
            return false;
        }
    }

    // Count the visual blocks
    var getVisualBlocksCount = function(vipsBlock) {
        if (vipsBlock.isVisualBlock())
            _visualBlocksCount++;
        for (var i = 0; i < vipsBlock.getChildren().length; i++) {
            if(!isTextNode(vipsBlock.getChildren()[i].getBox()))
                getVisualBlocksCount(vipsBlock.getChildren()[i]);
        }
    }

    // Function to return the block count
    this.getCount = function() {
        return _visualBlocksCount;
    }

    // Main function to construct the visual blocks from DOM Tree, pass in BODY and top level visual block
    var constructVipsBlockTree = function(element,node) {
        node.setBox(element);
        var element_list = element.children;

        if (!isTextNode(element)) {
            for(var i = 0; i < element_list.length; i++) {
                if (element_list[i].nodeName == "#comment" || element_list[i].nodeName == "SCRIPT"
                    || element_list[i].nodeName == "NOSCRIPT" || element_list[i].nodeName == "STYLE")
                    continue;
                node.addChild(new VipsBlock());
                constructVipsBlockTree(element_list[i], node.getChildren()[node.getChildren().length - 1]);
            }
        } 
    }

    // Main function to determine block division based on set of 12 rules and set their DoC
    var divideVipsBlockTree = function(vipsBlock) {
        _currentVipsBlock = vipsBlock;
        var elementBox = vipsBlock.getBox();

        //console.log(elementBox);
        //////console.log(elementBox.nodeName);
        //////console.log(elementBox.style.display);
        //////console.log(elementBox.nodeType);

        if (applyVipsRules(elementBox) && vipsBlock.isDividable() && !vipsBlock.isVisualBlock()) {
            // if element is dividable, let's divide it
            _currentVipsBlock.setAlreadyDivided(true);
            for (var i = 0; i < vipsBlock.getChildren().length; i++) {
                ////console.log(vipsBlock.getChildren()[i].getBox());
                if (!isTextNode(vipsBlock.getChildren()[i].getBox()))
                    divideVipsBlockTree(vipsBlock.getChildren()[i]);
            }
        }

        else {
            if (vipsBlock.isDividable()) {
                vipsBlock.setIsVisualBlock(true);
                vipsBlock.setDoC(11);
            }

            else {
                ////console.log(elementBox);
            }

            if (!verifyValidity(elementBox)) {
                ////console.log(elementBox);
                _currentVipsBlock.setIsVisualBlock(false);
            }
        }
    }

    // Called by verifyValidity
    var getOffset = function(el) {

        el = el.getBoundingClientRect();
        return {
            left: el.left + $(window).scrollLeft(),
            top: el.top + $(window).scrollTop()
        }
    }

    // Function to check if element is valid (visually on a webpage)
    var verifyValidity = function(node) {
        nlist = node.children;

        if (getOffset(node).left <= 0 || getOffset(node).top <= 0) {
            //////console.log(node + "1 failed");
            return false;
        }

        if (node.clientWidth <= 0 || node.clientHeight <= 0) {
            //////console.log(node + "2 failed");
            return false;
        }

        if($(node).is(':hidden')) {
            //////console.log(node + "4 failed");
            return false;
        }

        for (var i = 0; i < nlist.length; i++) {
            if (nlist[i].nodeName == "IMG") {
                return true;
            }
            if (nlist[i].nodeName == "INPUT") {
                return true;
            }
        }

        return true;

    }

    /** VIPS DOC Rules called by divideVipsBlockTree
     * On different DOM nodes it applies different sets of VIPS rules.
     * param node DOM node
     * return Returns true if element is dividable, otherwise false.
     */
    var applyVipsRules = function(node) {
        var ret = false;
        ////console.log(node);
        ////console.log(node.style.display);
        if (node.style.display == "inline") {
            ret = applyInlineTextNodeVipsRules(node);
        }
        else if (node.nodeName == "TABLE")
        {
            ret = applyTableNodeVipsRules(node);
        }
        else if (node.nodeName == "TR")
        {
            ret = applyTrNodeVipsRules(node);
        }
        else if (node.nodeName == "TD")
        {
            ret = applyTdNodeVipsRules(node);
        }
        else if (node.nodeName == "P")
        {
            ret = applyPNodeVipsRules(node);
        }
        else
        {
            ret = applyOtherNodeVipsRules(node);
        }

        return ret;
    }

    var applyOtherNodeVipsRules = function(node)
    {
        // 1 2 3 4 6 8 9 11

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleFour(node))
            return true;

        if (ruleSix(node))
            return true;

        if (ruleEight(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleEleven(node))
            return true;

        return false;
    }

    /**
     * Applies VIPS rules on &lt;P&gt; node.
     * @param node Node
     * @return Returns true if one of rules success and node is dividable.
     */
    var applyPNodeVipsRules = function(node)
    {
        // 1 2 3 4 5 6 8 9 11

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleFour(node))
            return true;

        if (ruleFive(node))
            return true;

        if (ruleSix(node))
            return true;

        if (ruleSeven(node))
            return true;

        if (ruleEight(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleTen(node))
            return true;

        if (ruleEleven(node))
            return true;

        if (ruleTwelve(node))
            return true;

        return false;
    }

    /**
     * Applies VIPS rules on &lt;TD&gt; node.
     * @param node Node
     * @return Returns true if one of rules success and node is dividable.
     */
    var applyTdNodeVipsRules = function(node)
    {
        // 1 2 3 4 8 9 10 12

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleFour(node))
            return true;

        if (ruleEight(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleTen(node))
            return true;

        if (ruleTwelve(node))
            return true;

        return false;
    }

    /**
     * Applies VIPS rules on &TR;&gt; node.
     * @param node Node
     * @return Returns true if one of rules success and node is dividable.
     */
    var applyTrNodeVipsRules = function(node)
    {
        // 1 2 3 7 9 12

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleSeven(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleTwelve(node))
            return true;

        return false;
    }

    /**
     * Applies VIPS rules on &lt;TABLE&gt; node.
     * @param node Node
     * @return Returns true if one of rules success and node is dividable.
     */
    var applyTableNodeVipsRules = function(node)
    {
        // 1 2 3 7 9 12

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleSeven(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleTwelve(node))
            return true;

        return false;
    }

    /**
     * Applies VIPS rules on inline nodes.
     * @param node Node
     * @return Returns true if one of rules success and node is dividable.
     */
    var applyInlineTextNodeVipsRules = function(node)
    {
        // 1 2 3 4 5 6 8 9 11

        if (ruleOne(node))
            return true;

        if (ruleTwo(node))
            return true;

        if (ruleThree(node))
            return true;

        if (ruleFour(node))
            return true;

        if (ruleFive(node))
            return true;

        if (ruleSix(node))
            return true;

        if (ruleEight(node))
            return true;

        if (ruleNine(node))
            return true;

        if (ruleTwelve(node))
            return true;

        return false;
    }


    // Helper functions
    var _cnt = 0;
    var checkValidChildrenNodes = function(node) {
        var nchild = node.childNodes;
        if (isTextNode(node)) {
            if (node.textContent != " " || node.textContent != "") {
                _cnt++;
            }
        }

        else {
            if(node.offsetWidth > 0 && node.offsetHeight > 0) {
                _cnt++;
            }
        }

        for(var i = 0; i < nchild.length; i++) {
            checkValidChildrenNodes(nchild[i]);
        }
    }

    var hasValidChildrenNodes = function(node) {
        var nchild = node.childNodes;
        if(node.nodeName == "IMG" || node.nodeName == "INPUT") {
            if (node.clientWidth > 0 && node.clientHeight > 0) {
                _currentVipsBlock.setIsVisualBlock(true);
                _currentVipsBlock.setDoC(8);
                return true;
            }

            else {
                return false;
            }
        }

        if(nchild == [] || nchild.length == 0) {
            return false;
        }

        _cnt = 0;

        for(var i = 0; i < nchild.length; i++) {
            checkValidChildrenNodes(nchild[i]);
        }

        return (_cnt > 0) ? true : false;
    }

    var numberOfValidChildNodes = function(node) {
        _cnt = 0;
        var nchild = node.childNodes;

        if(nchild == [] || nchild.length == 0) {
            return _cnt;
        }

        for(var i = 0; i < nchild.length; i++) {
            checkValidChildrenNodes(nchild[i]);
        }

        return _cnt;
    }

    /**
     * VIPS Rule One
     * <p>
     * If the DOM node is not a text node and it has no valid children, then
     * this node cannot be divided and will be cut.
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleOne = function(node)
    {
        if (!isTextNode(node))
        {
            if (!hasValidChildrenNodes(node))
            {
                //console.log("Rule 1 applied, Block is cut.")
                _currentVipsBlock.setIsDividable(false);
                return true;
            }
        }

        return false;
    }

    /**
     * VIPS Rule Two
     * <p>
     * If the DOM node has only one valid child and the child is not a text
     * node, then divide this node
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleTwo = function(node)
    {
        if (numberOfValidChildNodes(node) == 1)
        {
            if (!isTextNode(node.firstChild)) {
                //console.log("Rule 2 applied, Divide this block");
                return true;
            }
            else
                return false;
        }

        return false;
    }

    /**
     * VIPS Rule Three
     * <p>
     * If the DOM node is the root node of the sub-DOM tree (corresponding to
     * the block), and there is only one sub DOM tree corresponding to this
     * block, divide this node.
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleThree = function(node)
    {
        if (node.parentNode != null) {
            return false;
        }

        var result = true;
        var cnt = 0;

        for (var i = 0; i < _vipsBlocks.getChildren().length; i++)
        {
            if (_vipsBlocks.getChildren()[i].getBox().nodeName == node.nodeName)
            {
                result = true;
                isOnlyOneDomSubTree(node, _vipsBlocks.getChildren()[i].getBox(), result);

                if (result) {
                    cnt++;
                }
            }
        }

        return (cnt == 1) ? true : false;
    }

    /**
     * Checks if node's subtree is unique in DOM tree.
     * @param pattern Node for comparing
     * @param node Node from DOM tree
     * @param result True if element is unique otherwise false
     */
    var isOnlyOneDomSubTree = function(pattern, node, result)
    {
        if (pattern.nodeName != node.nodeName)
            result = false;

        if (pattern.children.length != node.children.length)
            result = false;

        if (!result)
            return;

        for (var i = 0; i < pattern.children.length; i++)
        {
            isOnlyOneDomSubTree(pattern.children[i], node.children[i], result);
        }
    }

    var isVirtualTextNode1 = function(node) {
        var nchild = node.children;
        if(node.style.display == "block") {
            return false;
        }

        for(var i = 0; i < nchild.length; i++) {
            if(!isTextNode(nchild[i]))
                return false;
        }

        return true;

    }

    var isVirtualTextNode2 = function(node) {
        var nchild = node.children;
        if(node.style.display == "block") {
            return false;
        }

        for(var i = 0; i < nchild.length; i++) {
            if(!isTextNode(nchild[i]) || !isVirtualTextNode1(nchild[i]))
                return false;
        }

        return true;

    }

    var isVirtualTextNode = function(node) {
        if (isVirtualTextNode1(node))
            return true;
        if (isVirtualTextNode2(node))
            return true;

        return false;
    }

    /**
     * VIPS Rule Four
     * <p>
     * If all of the child nodes of the DOM node are text nodes or virtual text
     * nodes, do not divide the node. <br>
     * If the font size and font weight of all these child nodes are same, set
     * the DoC of the extracted block to 10.
     * Otherwise, set the DoC of this extracted block to 9.
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleFour = function(node)
    {
        var i = 0;
        var child_list = node.children;

        if (child_list == [] || child_list.length == 0)
            return false;

        for (i = 0; i < child_list.length; i++)
        {
            if (isTextNode(child_list[i]))
                continue;
            if (!isTextNode(child_list[i]) ||
                    !isVirtualTextNode(child_list[i]))
                return false;
        }

        _currentVipsBlock.setIsVisualBlock(true);
        _currentVipsBlock.setIsDividable(false);

        if (child_list.length == 1)
        {
            if (child_list[0].nodeName == "EM")
                _currentVipsBlock.setDoC(11);
            else
                _currentVipsBlock.setDoC(10);
            //console.log("Rule 4 applied. This is a visual block with all text or virtual text nodes.");
            return true;
        }

        var f_weight = child_list[0].style.fontWeight;
        //////console.log(f_weight);
        var f_size = getComputedStyle(child_list[0]).getPropertyValue("font-size");

        for (i = 0; i < child_list.length; i++)
        {
            if (getComputedStyle(child_list[i]).getPropertyValue("font-weight") == null)
                return false;

            if (isTextNode(child_list[i]))
            {
                if (getComputedStyle(child_list[i]).getPropertyValue("font-size") != f_size || getComputedStyle(child_list[i]).getPropertyValue("font-weight") != f_weight)
                {
                    _currentVipsBlock.setDoC(9);
                    break;
                }
                else
                    _currentVipsBlock.setDoC(10);
            }

        }

        //console.log("Rule 4 applied. This is a visual block with all text or virtual text nodes.");
        return true;
    }

    /**
     * VIPS Rule Five
     * <p>
     * If one of the child nodes of the DOM node is line-break node, then
     * divide this DOM node.
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleFive = function(node)
    {
        var i = 0;
        var child_list = node.children;

        if (child_list == [] || child_list.length == 0)
            return false;

        for (i = 0; i < child_list.length; i++) {
            if (child_list[i].style.display == "block") {
                //console.log("Rule5 applied, divide this node");
                return true;
            }
        }

        return false;
    }

    /**
     * VIPS Rule Six
     * <p>
     * If one of the child nodes of the DOM node has HTML tag &lt;hr&gt;, then
     * divide this DOM node
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleSix = function(node)
    {
        var i = 0;
        var child_list = node.children;

        if (child_list == [] || child_list.length == 0)
            return false;

        for (i = 0; i < child_list.length; i++)
        {
            if (child_list[i].nodeName == "HR") {
                //console.log("Rule6 applied, divde this HR tag node");
                return true;
            }
        }

        return false;
    }

    /**
     * VIPS Rule Seven
     * <p>
     * If the background color of this node is different from one of its
     * children’s, divide this node and at the same time, the child node with
     * different background color will not be divided in this round.
     * Set the DoC value (6-8) for the child node based on the &lt;html&gt;
     * tag of the child node and the size of the child node.
     * 
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleSeven = function(node)
    {
        var nchild = node.children;

        if (nchild == [] || nchild.length == 0)
            return false;

        if (isTextNode(node))
            return false;

        //String nodeBgColor = node.getStylePropertyValue("background-color");
        var nodeBgColor = _currentVipsBlock.getBgColor();
        var block_child = _currentVipsBlock.getChildren()

        for (var i = 0; i < block_child.length; i++)
        {
            if (!(block_child[i].getBgColor() == nodeBgColor))
            {
                block_child[i].setIsDividable(false);
                block_child[i].setIsVisualBlock(true);
                block_child[i].setDoC(7);
                //console.log("Rule7 applied, don't divide this round");
                return true;
            }
        }

        return false;
    }


    var findTextChildrenNodes = function(node,results)
    {
        var nchild = node.children;
        if (isTextNode(node))
        {
            results.push(node);
            return;
        }

        for (var i = 0; i < nchild.length; i++)
        {
            findTextChildrenNodes(nchild[i], results);
        }
    }

    var getAllChildren = function(node,results) {
        var nchild = node.children;
        results.push(node);

        if(isTextNode(node))
            return;
        for (var i = 0; i < nchild.length; i++) {
            getAllChildren(nchild[i],results);
        }

    } 

    /**
     * VIPS Rule Eight
     * <p>
     * If the node has at least one text node child or at least one virtual
     * text node child, and the node's relative size is smaller than
     * a threshold, then the node cannot be divided.
     * Set the DoC value (from 5-8) based on the html tag of the node.
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleEight = function(node)
    {
        var nchild = node.children;
        var children = [];

        if (nchild == [] || nchild.length == 0)
            return false;

        findTextChildrenNodes(node, children);

        var cnt = children.length;

        if (cnt == 0)
            return false;

        if (node.clientWidth == 0 || node.clientHeight == 0)
        {
            children = [];

            getAllChildren(node, children);

            for (var i = 0; i < children.length; i++)
            {
                if (children[i].offsetWidth != 0 && children[i].offsetHeight != 0) {
                    ////console.log("Rule8 applied on " + node);
                    return true;
                }
            }
        }

        //*** added
        var temp_max = 0;
        for (var n = 0; n < nchild.length; n++) {
            if (nchild[i].clientHeight * nchild[i].clientWidth > temp_max) {
                temp_max = nchild[i].clientHeight * nchild[i].clientWidth;
            }
        }

        if (temp_max > node.clientWidth * node.clientHeight) {
            //console.log("Rule 8 applied, node has big children");
            return true;
        }

        if (node.clientWidth * node.clientHeight > _sizeTresholdHeight * _sizeTresholdWidth)
            return false;

        if (node.nodeName == "UL")
        {
            //console.log("Rule8 applied, divide b/c node is UL");
            return true;
        }

        _currentVipsBlock.setIsVisualBlock(true);
        _currentVipsBlock.setIsDividable(false);

        if (node.nodeName == "XDIV")
            _currentVipsBlock.setDoC(7);
        else if (node.nodeName == "CODE")
            _currentVipsBlock.setDoC(7);
        else if (node.nodeName == "DIV")
            _currentVipsBlock.setDoC(5);
        else
            _currentVipsBlock.setDoC(8);
        //console.log("Rule8 applied, don't divide");
        return true;
    }

    /**
     * VIPS Rule Nine
     * <p>
     * If the child of the node with maximum size are small than
     * a threshold (relative size), do not divide this node. <br>
     * Set the DoC based on the html tag and size of this node.
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleNine = function(node)
    {
        var nchild = [];
        getAllChildren(node,nchild);
        if (nchild.length == 0)
            return false;

        var maxSize = 0;
        var childSize = 0;

        for (var i = 0; i < nchild.length; i++)
        {
            childSize = nchild[i].clientWidth * nchild[i].clientHeight;

            if (maxSize < childSize)
            {
                maxSize = childSize;
            }
        }

        if (maxSize > _sizeTresholdWidth * _sizeTresholdHeight) {
            //console.log("Rule9 applied, large children");
            return true;
        }

        _currentVipsBlock.setIsVisualBlock(true);
        _currentVipsBlock.setIsDividable(false);

        if (node.nodeName == "XDIV")
            _currentVipsBlock.setDoC(7);
        if (node.nodeName == "A")
            _currentVipsBlock.setDoC(11);
        else
            _currentVipsBlock.setDoC(8);
        //////console.log("WHY "+ _currentVipsBlock.getDoC());
        ////console.log(maxSize);
        //console.log("Rule9 applied, don't divide b/c smaller than threshold");
        return true;
    }

    var findPreviousSiblingNodeVipsBlock = function(node,vipsBlock) {
        if(vipsBlock.getBox() == node) {
            _tempVipsBlock = vipsBlock;
            return
        }

        else {
            var bchild = vipsBlock.getChildren();
            for (var i = 0; i < bchild.length; i++) {
                findPreviousSiblingNodeVipsBlock(node, bchild[i]);
            }
        }
    }

    /**
     * VIPS Rule Ten
     * <p>
     * If previous sibling node has not been divided, do not divide this node
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleTen = function(node)
    {
        _tempVipsBlock = null;
        findPreviousSiblingNodeVipsBlock(node.previousSibling, _vipsBlocks);

        if (_tempVipsBlock == null)
            return false;

        if (_tempVipsBlock.isAlreadyDivided()) {
            //console.log("Rule10 applied on " + node);
            return true;
        }

        return false;
    }

    /**
     * VIPS Rule Eleven
     * <p>
     * Divide this node.
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleEleven = function(node)
    {
        //System.err.println("Applying rule Eleven on " + node.getNode().getNodeName() + " node");
        if(!isTextNode(node))
            //console.log("Rule11 applied on " + node);

        return (isTextNode(node)) ? false : true;
    }

    /**
     * VIPS Rule Twelve
     * <p>
     * Do not divide this node <br>
     * Set the DoC value based on the html tag and size of this node.
     * @param node
     *            Input node
     * 
     * @return True, if rule is applied, otherwise false.
     */
    var ruleTwelve = function(node)
    {

        _currentVipsBlock.setIsDividable(false);
        _currentVipsBlock.setIsVisualBlock(true);

        if (node.nodeName == "XDIV")
            _currentVipsBlock.setDoC(7);
        else if (node.nodeName == "LI")
            _currentVipsBlock.setDoC(8);
        else if (node.nodeName == "SPAN")
            _currentVipsBlock.setDoC(8);
        else if (node.nodeName == "SUP")
            _currentVipsBlock.setDoC(8);
        else if (node.nodeName == "IMG")
            _currentVipsBlock.setDoC(8);
        else
            _currentVipsBlock.setDoC(333);
        //console.log("Rule12 applied on " + node);
        return true;
    }
}

//----------------------------------------------------------------------------------------------
// Class for a point, use for separator class
function Point(_x,_y) {
    this.x = _x;
    this.y = _y;
}

// Class for a separator structure
function Separator(start,end) {
    this.startPoint = start;
    this.endPoint = end;
    this.weight = 3;
    this.normalizedWeight = 0;
    this.leftUp = null;
    this.rightDown = null;

    this.setLeftUp = function(leftUpX, leftUpY) {
        this.leftUp = new Point(leftUpX, leftUpY);
    }

    this.setRightDown = function(rightDownX, rightDownY)
    {
        this.rightDown = new Point(rightDownX, rightDownY);
    }

    this.compareTo = function(otherSeparator)
    {
        return this.weight - otherSeparator.weight;
    }
}

//-----------------------------------------------------------------------------------------------
// Class for Separator Detection, Second step of VIPS
function VipsSeparator(width,height) {

    var _vipsBlocks = null;
    var _visualBlocks = []; //visual block list
    //////console.log(_visualBlocks);
    var _horizontalSeparators = []; //horizontal separator list
    var _verticalSeparators = []; // vertical separator list

    var _width = width;
    var _height = height;
    var _cleanSeparatorsTreshold = 0;

    // Helper function to get an element's exact position
    var getPosition = function(el) {
        var xPos = 0;
        var yPos = 0;
     
        while (el) {
            if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;
     
                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }
     
            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }

    // Called by setVipsBlocks or fillpool
    var fillPoolWithBlocks = function(vipsBlock)
    {
        if (vipsBlock.isVisualBlock() && !isTextNode(vipsBlock.getBox()))
        {
            _visualBlocks.push(vipsBlock);
        }

        for (var i = 0; i < vipsBlock.getChildren().length; i++) {
            fillPoolWithBlocks(vipsBlock.getChildren()[i]);
        }
    }

    // Function to add visual blocks to pool
    this.fillPool = function()
    {
        if (_vipsBlocks != null || _vipsBlocks != undefined) {
            fillPoolWithBlocks(_vipsBlocks);
        }

    }

    // Function to initialize the visual block and add it to pool
    this.setVipsBlock = function(vipsBlock)
    {
        _vipsBlocks = vipsBlock;
        ////console.log(this._vipsBlocks);
        _visualBlocks = [];
        fillPoolWithBlocks(vipsBlock);
    }

    this.getVipsBlock = function()
    {
        return _vipsBlocks;
    }

    // Manually set the visual block lists
    this.setVisualBlockList = function(visualBlocks)
    {
        _visualBlocks = [];
        for (var i = 0; i < visualBlocks.length; i++) {
            _visualBlocks.push(visualBlocks[i]);
        }
    }

    this.getVisualBlocks = function()
    {
        return _visualBlocks;
    }

    // Function called by detectVerticalSeparators to find the vertical separators and its properties
    var findVerticalSeparators = function() {
        for (var i = 0; i < _visualBlocks.length; i++) {
            var xScroll = $(window).scrollLeft();
            var blockStart = _visualBlocks[i].getBox().getBoundingClientRect().left + xScroll;
            var blockEnd = _visualBlocks[i].getBox().getBoundingClientRect().right + xScroll;
            ////console.log(blockStart);
            ////console.log(blockEnd);

            for (var j = 0; j < _verticalSeparators.length; j++) {
                // find separator, that intersects with our visual block
                if (blockStart < _verticalSeparators[j].endPoint)
                {
                    // next there are six relations that the separator and visual block can have

                    // if separator is inside visual block
                    if (blockStart < _verticalSeparators[j].startPoint && blockEnd >= _verticalSeparators[j].endPoint)
                    {
                        //***check clone
                        var tempSeparators = _verticalSeparators.slice(0);

                        //remove all separators, that are included in block
                        for (var n = 0; n < tempSeparators.length; n++)
                        {
                            if (blockStart < tempSeparators[n].startPoint && blockEnd > tempSeparators[n].endPoint) {
                                //***check
                                var index = _verticalSeparators.indexOf(tempSeparators[n]);
                                if (index > -1) {
                                    _verticalSeparators.splice(index, 1);
                                }
                            }
                        }

                        //find separator, that is on end of this block (if exists)
                        for (var m = 0; m < _verticalSeparators.length; m++)
                        {
                            // and if it's necessary change it's start point
                            if (blockEnd > _verticalSeparators[m].startPoint && blockEnd < _verticalSeparators[m].endPoint)
                            {
                                _verticalSeparators[m].startPoint = blockEnd + 1;
                                break;
                            }
                        }
                        break;
                    }
                    // if block is inside another block -> skip it
                    if (blockEnd < _verticalSeparators[j].startPoint)
                        break;
                    // if separator starts in the middle of block
                    if (blockStart < _verticalSeparators[j].startPoint && blockEnd >= _verticalSeparators[j].startPoint)
                    {
                        // change separator start's point coordinate
                        _verticalSeparators[j].startPoint = blockEnd+1;
                        break;
                    }
                    // if block is inside the separator
                    if (blockStart >= _verticalSeparators[j].startPoint && blockEnd <= _verticalSeparators[j].endPoint)
                    {
                        if (blockStart == _verticalSeparators[j].startPoint)
                        {
                            _verticalSeparators[j].startPoint = blockEnd+1;
                            break;
                        }
                        if (blockEnd == _verticalSeparators[j].endPoint)
                        {
                            _verticalSeparators[j].endPoint = blockStart - 1;
                            break;
                        }
                        // add new separator that starts behind the block ***
                        _verticalSeparators.push(new Separator(blockEnd + 1, _verticalSeparators[j].endPoint));
                        // change end point coordinates of separator, that's before block
                        _verticalSeparators[j].endPoint = blockStart - 1;
                        break;
                    }
                    // if in one block is one separator ending and another one starting
                    if (blockStart > _verticalSeparators[j].startPoint && blockStart < _verticalSeparators[j].endPoint)
                    {
                        // find the next one
                        var nextSeparatorIndex =_verticalSeparators.indexOf(_verticalSeparators[j]);

                        // if it's not the last separator ***
                        if (nextSeparatorIndex + 1 < _verticalSeparators.length)
                        {
                            var nextSeparator = _verticalSeparators[_verticalSeparators.indexOf(_verticalSeparators[j]) + 1];

                            // next separator is really starting before the block ends
                            if (blockEnd > nextSeparator.startPoint && blockEnd < nextSeparator.endPoint)
                            {
                                // change separator start point coordinate
                                _verticalSeparators[j].endPoint = blockStart - 1;
                                nextSeparator.startPoint = blockEnd + 1;
                                break;
                            }
                            else
                            {
                                var tempSeparators = _verticalSeparators.slice(0);

                                //remove all separators, that are included in block ***
                                for (var l = 0; l < tempSeparators.length; l++)
                                {
                                    if (blockStart < tempSeparators[l].startPoint && tempSeparators[l].endPoint < blockEnd)
                                    {
                                        _verticalSeparators.splice(_verticalSeparators.indexOf(tempSeparators[l]),1);
                                        continue;
                                    }
                                    if (blockEnd > tempSeparators[l].startPoint && blockEnd < tempSeparators[l].endPoint)
                                    {
                                        // change separator start's point coordinate
                                        tempSeparators[l].startPoint = blockEnd+1;
                                        break;
                                    }
                                    if (blockStart > tempSeparators[l].startPoint && blockStart < tempSeparators[l].endPoint)
                                    {
                                        tempSeparators[l].endPoint = blockStart-1;
                                        continue;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // if separator ends in the middle of block
                    // change it's end point coordinate
                    _verticalSeparators[j].endPoint = blockStart-1;
                    break;
                }
            }
        }
    }

    // Function called by detectHorizontalSeparators to find horizontal separators and their properties
    var findHorizontalSeparators = function() {
        for (var i = 0; i < _visualBlocks.length; i++) {
            var yScroll = $(window).scrollTop();
            var blockStart = _visualBlocks[i].getBox().getBoundingClientRect().top + yScroll;
            var blockEnd = _visualBlocks[i].getBox().getBoundingClientRect().bottom + yScroll;
            //console.log(blockStart);
            //console.log(blockEnd);

            for (var j = 0; j < _horizontalSeparators.length; j++) {
                // find separator, that intersects with our visual block
                if (blockStart < _horizontalSeparators[j].endPoint)
                {
                    // next there are six relations that the separator and visual block can have

                    // if separator is inside visual block
                    if (blockStart < _horizontalSeparators[j].startPoint && blockEnd >= _horizontalSeparators[j].endPoint)
                    {
                        //***check clone
                        var tempSeparators = _horizontalSeparators.slice(0);

                        //remove all separators, that are included in block
                        for (var n = 0; n < tempSeparators.length; n++)
                        {
                            if (blockStart < tempSeparators[n].startPoint && blockEnd > tempSeparators[n].endPoint) {
                                //***check
                                var index = _horizontalSeparators.indexOf(tempSeparators[n]);
                                if (index > -1) {
                                    _horizontalSeparators.splice(index, 1);
                                }
                            }
                        }

                        //find separator, that is on end of this block (if exists)
                        for (var m = 0; m < _horizontalSeparators.length; m++)
                        {
                            // and if it's necessary change it's start point
                            if (blockEnd > _horizontalSeparators[m].startPoint && blockEnd < _horizontalSeparators[m].endPoint)
                            {
                                _horizontalSeparators[m].startPoint = blockEnd + 1;
                                break;
                            }
                        }
                        break;
                    }
                    // if block is inside another block -> skip it
                    if (blockEnd < _horizontalSeparators[j].startPoint)
                        break;
                    // if separator starts in the middle of block
                    if (blockStart < _horizontalSeparators[j].startPoint && blockEnd >= _horizontalSeparators[j].startPoint)
                    {
                        // change separator start's point coordinate
                        _horizontalSeparators[j].startPoint = blockEnd+1;
                        break;
                    }
                    // if block is inside the separator
                    if (blockStart >= _horizontalSeparators[j].startPoint && blockEnd <= _horizontalSeparators[j].endPoint)
                    {
                        if (blockStart == _horizontalSeparators[j].startPoint)
                        {
                            _horizontalSeparators[j].startPoint = blockEnd+1;
                            break;
                        }
                        if (blockEnd == _horizontalSeparators[j].endPoint)
                        {
                            _horizontalSeparators[j].endPoint = blockStart - 1;
                            break;
                        }
                        // add new separator that starts behind the block ***
                        _horizontalSeparators.push(new Separator(blockEnd + 1, _horizontalSeparators[j].endPoint));
                        //////console.log(_horizontalSeparators);
                        // change end point coordinates of separator, that's before block
                        _horizontalSeparators[j].endPoint = blockStart - 1;
                        break;
                    }
                    // if in one block is one separator ending and another one starting
                    if (blockStart > _horizontalSeparators[j].startPoint && blockStart < _horizontalSeparators[j].endPoint)
                    {
                        // find the next one
                        var nextSeparatorIndex = _horizontalSeparators.indexOf(_horizontalSeparators[j]);

                        // if it's not the last separator ***
                        if (nextSeparatorIndex + 1 < _verticalSeparators.length)
                        {
                            var nextSeparator = _horizontalSeparators[_horizontalSeparators.indexOf(_horizontalSeparators[j]) + 1];

                            // next separator is really starting before the block ends
                            if (blockEnd > nextSeparator.startPoint && blockEnd < nextSeparator.endPoint)
                            {
                                // change separator start point coordinate
                                _horizontalSeparators[j].endPoint = blockStart - 1;
                                nextSeparator.startPoint = blockEnd + 1;
                                break;
                            }
                            else
                            {
                                var tempSeparators = _horizontalSeparators.slice(0);

                                //remove all separators, that are included in block ***
                                for (var l = 0; l < tempSeparators.length; l++)
                                {
                                    if (blockStart < tempSeparators[l].startPoint && tempSeparators[l].endPoint < blockEnd)
                                    {
                                        _horizontalSeparators.splice(_horizontalSeparators.indexOf(tempSeparators[l]),1);
                                        continue;
                                    }
                                    if (blockEnd > tempSeparators[l].startPoint && blockEnd < tempSeparators[l].endPoint)
                                    {
                                        // change separator start's point coordinate
                                        tempSeparators[l].startPoint = blockEnd+1;
                                        break;
                                    }
                                    if (blockStart > tempSeparators[l].startPoint && blockStart < tempSeparators[l].endPoint)
                                    {
                                        tempSeparators[l].endPoint = blockStart-1;
                                        continue;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // if separator ends in the middle of block
                    // change it's end point coordinate
                    _horizontalSeparators[j].endPoint = blockStart-1;
                    break;
                }
            }
        }
    }

    // Function that removes the end separators and compute weight
    this.detectHorizontalSeparators = function()
    {
        if (_visualBlocks.length == 0)
        {
            ////console.log("I don't have any visual blocks!");
            return;
        }

        _horizontalSeparators.push(new Separator(0, _height));

        findHorizontalSeparators();

        //remove pool borders
        var tempSeparators = _horizontalSeparators.slice(0);

        for (var i = 0; i < tempSeparators.length; i++)
        {
            if (tempSeparators[i].startPoint == 0) {
                _horizontalSeparators.splice(_horizontalSeparators.indexOf(tempSeparators[i]),1);
            }
            if (tempSeparators[i].endPoint == _height) {
                _horizontalSeparators.splice(_horizontalSeparators.indexOf(tempSeparators[i]),1);
            }
        }

        if (_cleanSeparatorsTreshold != 0)
            cleanUpSeparators(_horizontalSeparators);

        computeHorizontalWeights();
        sortSeparatorsByWeight(_horizontalSeparators);
    }

    // Function that removes the end separators and compute weight
    this.detectVerticalSeparators = function()
    {
        if (_visualBlocks.length == 0)
        {
            ////console.log("I don't have any visual blocks!");
            return;
        }

        _verticalSeparators.push(new Separator(0, _width));

        findVerticalSeparators();

        //remove pool borders
        var tempSeparators = _verticalSeparators.slice(0);

        for (var i = 0; i < tempSeparators.length; i++)
        {
            if (tempSeparators[i].startPoint == 0) {
                _verticalSeparators.splice(_verticalSeparators.indexOf(tempSeparators[i]),1);
            }
            if (tempSeparators[i].endPoint == _width) {
                _verticalSeparators.splice(_verticalSeparators.indexOf(tempSeparators[i]),1);
            }
        }

        if (_cleanSeparatorsTreshold != 0)
            cleanUpSeparators(_verticalSeparators);

        computeVerticalWeights();
        sortSeparatorsByWeight(_verticalSeparators);
        ////console.log(_verticalSeparators);
    }

    // Clean up separators that fall below a certain threshold
    var cleanUpSeparators = function(separators)
    {
        tempList = separators;

        for (var i = 0; i < tempList.length; i++)
        {
            var widtht = tempList[i].endPoint - tempList[i].startPoint + 1;

            if (widtht < _cleanSeparatorsTreshold)
                separators.splice(separators.indexOf(tempList[i]),1);
        }
    }

    // Sort separator by weight
    var sortSeparatorsByWeight = function(separators)
    {
        separators.sort(function(a, b) {
            return a.weight-b.weight
        });
    }

    /**
     * Computes weights for vertical separators.
     */
    var computeVerticalWeights = function() {
        for (var j = 0; j < _verticalSeparators.length; j++)
        {
            ruleOne(_verticalSeparators[j]);
            ruleTwo(_verticalSeparators[j], false);
            ruleThree(_verticalSeparators[j], false);
        }
    }

    /**
     * Computes weights for horizontal separators.
     */
    var computeHorizontalWeights = function() {
        //////console.log("hi");
        for (var j = 0; j < _horizontalSeparators.length; j++)
        {
            ruleOne(_horizontalSeparators[j]);
            ruleTwo(_horizontalSeparators[j], true);
            ruleThree(_horizontalSeparators[j],true);
            ruleFour(_horizontalSeparators[j]);
            ruleFive(_horizontalSeparators[j]);
        }
    }

    /**
     * The greater the distance between blocks on different
     * side of the separator, the higher the weight. <p>
     * For every 10 points of width we increase weight by 1 points.
     * @param separator Separator
     */
    var ruleOne = function(separator)
    {
        //***check width with java
        var width = separator.endPoint - separator.startPoint + 1;

        //separator.weight += width;

        if (width > 55 )
            separator.weight += 12;
        if (width > 45 && width <= 55)
            separator.weight += 10;
        if (width > 35 && width <= 45)
            separator.weight += 8;
        if (width > 25 && width <= 35)
            separator.weight += 6;
        else if (width > 15 && width <= 25)
            separator.weight += 4;
        else if (width > 8 && width <= 15)
            separator.weight += 2;
        else
            separator.weight += 1;

    }

    /**
     * If a visual separator is overlapped with some certain HTML
     * tags (e.g., the &lt;HR&gt; HTML tag), its weight is set to be higher.
     * @param separator Separator
     */
    var ruleTwo = function(separator, horizontal)
    {
        var overlappedElements = [];
        if (horizontal)
            findHorizontalOverlappedElements(separator, overlappedElements);
        else
            findVerticalOverlappedElements(separator, overlappedElements);

        //***check
        if (overlappedElements.length == 0)
            return;

        for (var i = 0; i < overlappedElements.length; i++)
        {
            if (overlappedElements[i].getBox().nodeName == "HR")
            {
                separator.weight += 2;
                break;
            }
        }
    }

    /**
     * Finds elements that are overlapped with horizontal separator.
     * @param separator Separator, that we look at
     * @param vipsBlock Visual block corresponding to element
     * @param result Elements, that we found
     */
    var findHorizontalOverlappedElements = function(separator, result)
    {
        for (var i = 0; i < _visualBlocks.length; i++)
        {
            var yScroll = $(window).scrollTop();
            var ebox = _visualBlocks[i].getBox().getBoundingClientRect();
            var topEdge = ebox.top + yScroll;
            var bottomEdge = ebox.bottom + yScroll;

            // two upper edges of element are overlapped with separator
            if (topEdge > separator.startPoint && topEdge < separator.endPoint && bottomEdge > separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }

            // two bottom edges of element are overlapped with separator
            if (topEdge < separator.startPoint && bottomEdge > separator.startPoint && bottomEdge < separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }

            // all edges of element are overlapped with separator
            if (topEdge >= separator.startPoint && bottomEdge <= separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }

        }
    }

    /**
     * Finds elements that are overlapped with vertical separator.
     * @param separator Separator, that we look at
     * @param vipsBlock Visual block corresponding to element
     * @param result Elements, that we found
     */
    var findVerticalOverlappedElements = function(separator, result)
    {
        for (var i = 0; i < _visualBlocks.length; i++)
        {
            var xScroll = $(window).scrollLeft();
            var ebox = _visualBlocks[i].getBox().getBoundingClientRect();
            var leftEdge = ebox.left + xScroll;
            var rightEdge = ebox.right + xScroll;

            // two left edges of element are overlapped with separator
            if (leftEdge > separator.startPoint && leftEdge < separator.endPoint && rightEdge > separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }

            // two right edges of element are overlapped with separator
            if (leftEdge < separator.startPoint && rightEdge > separator.startPoint && rightEdge < separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }

            // all edges of element are overlapped with separator
            if (leftEdge >= separator.startPoint && rightEdge <= separator.endPoint)
            {
                result.push(_visualBlocks[i]);
            }
        }
    }

    /**
     * If background colors of the blocks on two sides of the separator
     * are different, the weight will be increased.
     * @param separator Separator
     */
    var ruleThree = function(separator, horizontal)
    {
        // for vertical is represents elements on left side
        var topAdjacentElements = [];
        // for vertical is represents elements on right side
        var bottomAdjacentElements = [];
        if (horizontal)
            findHorizontalAdjacentBlocks(separator, topAdjacentElements, bottomAdjacentElements);
        else
            findVerticalAdjacentBlocks(separator, topAdjacentElements, bottomAdjacentElements);

        if (topAdjacentElements.length < 1 || bottomAdjacentElements.length < 1)
            return;

        var weightIncreased = false;
        //////console.log(topAdjacentElements);

        for (var i = 0; i < topAdjacentElements.length; i++)
        {
            for (var j = 0; j < bottomAdjacentElements.length; j++)
            {
                if (topAdjacentElements[i].getBgColor() != bottomAdjacentElements[j].getBgColor())
                {
                    separator.weight += 2;
                    weightIncreased = true;
                    break;
                }
            }
            if (weightIncreased)
                break;
        }
    }

    /**
     * Finds elements that are adjacent to horizontal separator.
     * @param separator Separator, that we look at
     * @param vipsBlock Visual block corresponding to element
     * @param resultTop Elements, that we found on top side of separator
     * @param resultBottom Elements, that we found on bottom side side of separator
     */
    var findHorizontalAdjacentBlocks = function(separator, resultTop, resultBottom)
    {
        for (var i = 0; i < _visualBlocks.length; i++)
        {
            var yScroll = $(window).scrollTop();
            var ebox = _visualBlocks[i].getBox().getBoundingClientRect();
            var topEdge = ebox.top + yScroll;
            var bottomEdge = ebox.bottom + yScroll;

            // if box is adjancent to separator from bottom
            if (topEdge == separator.endPoint + 1 && bottomEdge > separator.endPoint + 1)
            {
                resultBottom.push(_visualBlocks[i]);
            }

            // if box is adjancent to separator from top
            if (bottomEdge == separator.startPoint - 1 && topEdge < separator.startPoint - 1)
            {
                resultTop.push(_visualBlocks[i]);
            }
        }
    }

    /**
     * Finds elements that are adjacent to vertical separator.
     * @param separator Separator, that we look at
     * @param vipsBlock Visual block corresponding to element
     * @param resultLeft Elements, that we found on left side of separator
     * @param resultRight Elements, that we found on right side side of separator
     */
    var findVerticalAdjacentBlocks = function(separator, resultLeft, resultRight)
    {
        for (var i = 0; i < _visualBlocks.length; i++)
        {
            var xScroll = $(window).scrollLeft();
            var ebox = _visualBlocks[i].getBox().getBoundingClientRect();
            var leftEdge = ebox.left + xScroll;
            var rightEdge = ebox.right + xScroll;

            // if box is adjancent to separator from right
            if (leftEdge == separator.endPoint + 1 && rightEdge > separator.endPoint + 1)
            {
                resultRight.push(_visualBlocks[i]);
            }

            // if box is adjancent to separator from left
            if (rightEdge == separator.startPoint - 1 && leftEdge < separator.startPoint - 1)
            {
                resultLeft.push(_visualBlocks[i]); // ???
            }
        }
    }

    /**
     * For horizontal separators, if the differences of font properties
     * such as font size and font weight are bigger on two
     * sides of the separator, the weight will be increased.
     * Moreover, the weight will be increased if the font size of the block
     * above the separator is smaller than the font size of the block
     * below the separator.
     * @param separator Separator
     */
    var ruleFour = function(separator)
    {
        var topAdjacentElements = [];
        var bottomAdjacentElements = [];

        findHorizontalAdjacentBlocks(separator, topAdjacentElements, bottomAdjacentElements);

        if (topAdjacentElements.length < 1 || bottomAdjacentElements.length < 1)
            return;

        var weightIncreased = false;

        for (var i = 0; i < topAdjacentElements.length; i++)
        {
            for (var j = 0; j < bottomAdjacentElements.length; j++)
            {
                var diff = Math.abs(parseInt(getComputedStyle(topAdjacentElements[i].getBox()).getPropertyValue("font-size")) - parseInt(getComputedStyle(bottomAdjacentElements[j].getBox()).getPropertyValue("font-size")));
                if (diff != 0)
                {
                    separator.weight += 2;
                    weightIncreased = true;
                    break;
                }
                else
                {
                    if (getComputedStyle(topAdjacentElements[i].getBox()).getPropertyValue("font-weight") != getComputedStyle(bottomAdjacentElements[j].getBox()).getPropertyValue("font-weight"))
                    {
                        separator.weight += 2;
                    }
                }
            }
            if (weightIncreased)
                break;
        }

        weightIncreased = false;

        for (var k = 0; k < topAdjacentElements.length; k++)
        {
            for (var l = 0; l < bottomAdjacentElements.length; l++)
            {
                if (parseInt(getComputedStyle(topAdjacentElements[k].getBox()).getPropertyValue("font-size")) < parseInt(getComputedStyle(bottomAdjacentElements[l].getBox()).getPropertyValue("font-size")))
                {
                    separator.weight += 2;
                    weightIncreased = true;
                    break;
                }
            }
            if (weightIncreased)
                break;
        }
    }

    // Helper function to check if node is text node
    var isTextNode = function(el) {
        if (el.nodeType == 3) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * For horizontal separators, when the structures of the blocks on the two
     * sides of the separator are very similar (e.g. both are text),
     * the weight of the separator will be decreased.
     * @param separator Separator
     */
    var ruleFive = function(separator)
    {
        var topAdjacentElements = [];
        var bottomAdjacentElements = [];

        findHorizontalAdjacentBlocks(separator, topAdjacentElements, bottomAdjacentElements);

        if (topAdjacentElements.length < 1 || bottomAdjacentElements.length < 1)
            return;

        var weightDecreased = false;

        for (var i = 0; i < topAdjacentElements.length; i++)
        {
            for (var j = 0; j < bottomAdjacentElements.length; j++)
            {
                if (isTextNode(topAdjacentElements[i].getBox()) &&
                        isTextNode(bottomAdjacentElements[j].getBox()))
                {
                    separator.weight -= 2;
                    weightDecreased = true;
                    break;
                }
            }
            if (weightDecreased)
                break;
        }
    }

    // Function that return the separator found
    this.getHorizontalSeparators = function()
    {
        return _horizontalSeparators;
    }

    // Function to set the horizontal separator manually
    this.setHorizontalSeparators = function(separators)
    {
        _horizontalSeparators = [];

        for (var i = 0; i < separators.length; i++) {
            _horizontalSeparators.push(separators[i]);
        }
    }

    // function to set the vertical separator manually
    this.setVerticalSeparators = function(separators)
    {
        _verticalSeparators = [];

        for (var i = 0; i < separators.length; i++) {
            _verticalSeparators.push(separators[i]);
        }
    }

    // Function to return the separator found
    this.getVerticalSeparators = function()
    {
        return _verticalSeparators;
    }

    // Set cleanup threshold
    this.setCleanUpSeparators = function(treshold)
    {
        this._cleanSeparatorsTreshold = treshold;
    }

    this.isCleanUpEnabled = function()
    {
        if (_cleanSeparatorsTreshold == 0)
            return true;

        return false;
    }
}

//----------------------------------------------------------------------------------------
/**
 * Class that represents visual structure.
 */
function VisualStructure() {

    var _nestedBlocks = [];
    var _childrenVisualStructures = [];
    var _horizontalSeparators = [];
    var _verticalSeparators = [];
    var _width = 0;
    var _height = 0;
    var _x = 0;
    var _y = 0;
    var _doC = 12;
    var _containImg = -1;
    var _containP = -1;
    var _textLength = -1;
    var _linkTextLength = -1;
    var _order;
    var _containTable = false;
    var _id = "";
    var _tmpSrcIndex = 0;
    var _srcIndex = 0;
    var _minimalDoC = 0;

    var _startY = 0;
    var _startX = 0;
    var _endY = 0;
    var _endX = 0;


    /**
     * @return Nested blocks in structure
     */
    this.getNestedBlocks = function()
    {
        return _nestedBlocks;
    }

    /**
     * Adds block to nested blocks
     * @param nestedBlock New block
     */
    this.addNestedBlock = function(nestedBlock)
    {
        _nestedBlocks.push(nestedBlock);
    }

    /**
     * Adds blocks to nested blocks
     * @param nestedBlocks
     */
    this.addNestedBlocks = function(nestedBlocks)
    {
        for (var i = 0; i < nestedBlocks.length; i++) {
            _nestedBlocks.push(nestedBlocks[i]);
        }
    }

    /**
     * Sets blocks as nested blocks
     * @param vipsBlocks
     */
    this.setNestedBlocks = function(vipsBlocks)
    {
        _nestedBlocks = vipsBlocks.slice(0);
    }

    /**
     * Clears nested blocks list
     */
    this.clearNestedBlocks = function()
    {
        _nestedBlocks.length = 0;
    }

    /**
     * Removes nested block at given index
     * @param index Index of block
     */
    this.removeNestedBlockAt = function(index)
    {
        _nestedBlocks.splice(index,1);
    }

    /**
     * Removes given child from structures children
     * @param visualStructure Child
     */
    this.removeChild = function(visualStructure)
    {
        _childrenVisualStructures.splice(_childrenVisualStructures.indexOf(visualStructure),1);
    }

    /**
     * Adds new child to visual structure children
     * @param visualStructure New child
     */
    this.addChild = function(visualStructure)
    {
        _childrenVisualStructures.push(visualStructure);
    }

    /**
     * Adds new child to visual structure at given index
     * @param visualStructure New child
     * @param index Index
     */
    this.addChildAt = function(visualStructure, index)
    {
        //!!!
        _childrenVisualStructures[index] = visualStructure;
    }

    /**
     * Returns all children structures
     * @return Children structures
     */
    this.getChildrenVisualStructures = function()
    {
        return _childrenVisualStructures;
    }

    /**
     * Sets visual structures as children of visual structure
     * @param childrenVisualStructures List of visual structures
     */
    this.setChildrenVisualStructures = function(childrenVisualStructures)
    {
        _childrenVisualStructures = childrenVisualStructures;
    }

    /**
     * Returns all horizontal separators form structure
     * @return List of horizontal separators
     */
    this.getHorizontalSeparators = function()
    {
        return _horizontalSeparators;
    }

    /**
     * Sets list of separators as horizontal separators of structure
     * @param horizontalSeparators List of separators
     */
    this.setHorizontalSeparators = function(horizontalSeparators)
    {
        _horizontalSeparators = horizontalSeparators;
    }

    /**
     * Adds separator to horizontal separators of structure
     * @param horizontalSeparator
     */
    this.addHorizontalSeparator = function(horizontalSeparator)
    {
        _horizontalSeparators.push(horizontalSeparator);

    }

    /**
     * Adds separators to horizontal separators of structure
     * @param horizontalSeparators
     */
    this.addHorizontalSeparators = function(horizontalSeparators)
    {
        for (var i = 0; i < horizontalSeparators.length; i++) {
            _horizontalSeparators.push(horizontalSeparators[i]);
        }
    }

    /**
     * Returns X structure's coordinate
     * @return X coordinate
     */
    this.getX = function()
    {
        return _x;
    }

    /**
     * Returns structure's Y coordinate
     * @return Y coordinate
     */
    this.getY = function()
    {
        return _y;
    }

    /**
     * Sets X coordinate
     * @param x X coordinate
     */
    this.setX = function(x)
    {
        _x = x;
    }

    /**
     * Sets Y coordinate
     * @param y Y coordinate
     */
    this.setY = function(y)
    {
        _y = y;
    }

    /**
     * Sets width of visual structure
     * @param width Width
     */
    this.setWidth = function(width)
    {
        _width = width;
    }

    /**
     * Sets height of visual structure
     * @param height Height
     */
    this.setHeight = function(height)
    {
        _height = height;
    }

    /**
     * Returns width of visual structure
     * @return Visual structure's width
     */
    this.getWidth = function()
    {
        return _width;
    }

    /**
     * Returns height of visual structure
     * @return Visual structure's height
     */
    this.getHeight = function()
    {
        return _height;
    }

    /**
     * Returns list of all vertical separators in visual structure
     * @return List of vertical separators
     */
    this.getVerticalSeparators = function()
    {
        return _verticalSeparators;
    }

    /**
     * Sets list of separators as vertical separators of structure
     * @param _verticalSeparators List of separators
     */
    this.setVerticalSeparators = function(_verticalSeparators)
    {
        _verticalSeparators = _verticalSeparators;
    }

    /**
     * Adds separator to structure's vertical sepators
     * @param verticalSeparator
     */
    this.addVerticalSeparator = function(verticalSeparator)
    {
        _verticalSeparators.push(verticalSeparator);
    }

    /**
     * Sets if of visual structure
     * @param id Id
     */
    this.setId = function(id)
    {
        _id = id;
    }

    /**
     * Returns id of visual structure
     * @return Visual structure's id
     */
    this.getId = function()
    {
        return _id;
    }

    /**
     * Sets visual structure's degree of coherence DoC
     * @param doC Degree of coherence - DoC
     */
    this.setDoC = function(doC)
    {
        _doC = doC;
    }

    /**
     * Returns structure's degree of coherence DoC
     * @return Degree of coherence - DoC
     */
    this.getDoC = function()
    {
        return _doC;
    }

    /**
     * Finds minimal DoC in all children visual structures
     * @param visualStructure Given visual structure
     */
    var findMinimalDoC = function(visualStructure)
    {
        if (parseInt(visualStructure.getId()) != 1)
        {
            if (visualStructure.getDoC() < _minimalDoC)
                _minimalDoC = visualStructure.getDoC();
        }

        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++)
        {
            findMinimalDoC(visualStructure.getChildrenVisualStructures()[i]);
        }
    }

    /**
     * Updates DoC to normalized DoC
     */
    this.updateToNormalizedDoC = function(visualStructure)
    {
        _doC = 12;

        for (var i = 0; i < _horizontalSeparators.length; i++)
        {
            if (_horizontalSeparators[i].normalizedWeight < _doC)
                _doC = _horizontalSeparators[i].normalizedWeight;
        }

        for (var j = 0; j < _verticalSeparators.length; j++)
        {
            if (_verticalSeparators[j].normalizedWeight < _doC)
                _doC = _verticalSeparators[j].normalizedWeight;
        }

        if (_doC == 12)
        {
            for (var k = 0; k < _nestedBlocks.length; k++)
            {
                if (_nestedBlocks[k].getDoC() < _doC)
                    _doC = _nestedBlocks[k].getDoC();
            }
        }

        _minimalDoC = 12;

        //***
        findMinimalDoC(visualStructure);

        if (_minimalDoC < _doC)
            _doC = _minimalDoC;
    }

    this.setOrder = function(order)
    {
        _order = order;
    }

    /**
     * Returns visual structure order
     * @return Visual structure order
     */
    this.getOrder = function()
    {
        return _order;
    }

    /**
     * Adds list of separators to visual structure vertical separators list.
     * @param verticalSeparators
     */
    this.addVerticalSeparators = function(verticalSeparators)
    {
        for (var i = 0; i < verticalSeparators.length; i++) {
            _verticalSeparators.push(verticalSeparators[i]);
        }
    }

    //#################################
    // My interpretation
    this.setStartY = function(sy) {
        _startY = sy;
    }

    this.setStartX = function(sx) {
        _startX = sx;
    }

    this.setEndY = function(ey) {
        _endY = ey;
    }

    this.setEndX = function(ex) {
        _endX = ex;
    }

    this.getStartY = function() {
        return _startY;
    }

    this.getStartX = function() {
        return _startX;
    }

    this.getEndY = function() {
        return _endY;
    }

    this.getEndX = function() {
        return _endX;
    }
}

//---------------------------------------------------------------------------------
/**
 * Class that constructs final visual structure of page.
 *
 */
function VisualStructureConstructor() {

    var _vipsBlocks = null;
    var _visualBlocks = [];
    var _visualStructure = null;
    var _horizontalSeparators = [];
    var _verticalSeparators = [];
    var _pageWidth = Math.max($(document).width(), $(window).width());
    var _pageHeight = Math.max($(document).height(), $(window).height());
    var _srcOrder = 1;
    var _iteration = 0;
    var _pDoC = 5;
    var _maxDoC = 11;
    var _minDoC = 11;

    /**
     * Sets Permitted Degree of Coherence
     * @param pDoC Permitted Degree of Coherence
     */
    this.setPDoC = function(pDoC)
    {
        if (pDoC <= 0 || pDoC> 11)
        {
            ////console.log("pDoC value must be between 1 and 11! Not " + pDoC + "!");
            return;
        }
        else
        {
            _pDoC = pDoC;
        }
    }

    /**
     * Tries to construct visual structure
     */
    this.constructVisualStructure = function()
    {
        _iteration++;

        // in first iterations we try to find vertical separators before horizontal
        if (_iteration < 4)
        {
            constructVerticalVisualStructure();
            constructHorizontalVisualStructure();
            //constructVerticalVisualStructure();
            //constructHorizontalVisualStructure();
        }
        else
        {
            // and now we are trying to find horizontal before verical sepators
            constructHorizontalVisualStructure();
            constructVerticalVisualStructure();
        }

        if (_iteration != 1)
            updateSeparators();

        //sets order to visual structure
        _srcOrder = 1;
        setOrder(_visualStructure);

        //console.log(_visualStructure.getChildrenVisualStructures());
        // for (var n = 0; n < _visualBlocks.length; n++) {
        //     //console.log(_visualBlocks[n].getBox());
        // }
    }

    /**
     * Constructs visual structure with blocks and horizontal separators
     */
    var constructHorizontalVisualStructure = function()
    {
        // first run
        if (_visualStructure == null)
        {
            var detector = new VipsSeparator(_pageWidth, _pageHeight);

            detector.setCleanUpSeparators(3);
            detector.setVipsBlock(_vipsBlocks);
            detector.setVisualBlocks(_visualBlocks);
            detector.detectHorizontalSeparators();
            _horizontalSeparators = detector.getHorizontalSeparators();
            //!!!
            _horizontalSeparators.sort(function(a, b) {
                return a.weight-b.weight
            });

            _visualStructure = new VisualStructure();
            _visualStructure.setId("1");
            _visualStructure.setNestedBlocks(_visualBlocks);
            _visualStructure.setWidth(_pageWidth);
            _visualStructure.setHeight(_pageHeight);

            for (var i = 0; i < _horizontalSeparators.length; i++)
            {
                _horizontalSeparators[i].setLeftUp(_visualStructure.getX(), _horizontalSeparators[i].startPoint);
                _horizontalSeparators[i].setRightDown(_visualStructure.getX()+_visualStructure.getWidth(), _horizontalSeparators[i].endPoint);
            }

            constructWithHorizontalSeparators(_visualStructure);
        }
        else
        {
            var listStructures = [];
            findListVisualStructures(_visualStructure, listStructures);

            for (var j = 0; j < listStructures.length; j++)
            {
                var detector = new VipsSeparator(_pageWidth, _pageHeight);

                detector.setCleanUpSeparators(4);

                detector.setVipsBlock(_vipsBlocks);
                detector.setVisualBlocks(listStructures[j].getNestedBlocks());
                detector.detectHorizontalSeparators();
                _horizontalSeparators = detector.getHorizontalSeparators();

                for (var k = 0; k < _horizontalSeparators.length; k++)
                {
                    _horizontalSeparators[k].setLeftUp(listStructures[j].getX(), _horizontalSeparators[k].startPoint);
                    _horizontalSeparators[k].setRightDown(listStructures[j].getX()+listStructures[j].getWidth(), _horizontalSeparators[k].endPoint);
                }

                constructWithHorizontalSeparators(listStructures[j]);
            }
        }
    }

    /**
     * Constructs visual structure with blocks and vertical separators
     */
    var constructVerticalVisualStructure = function()
    {
        // first run
        if (_visualStructure == null)
        {
            var detector = new VipsSeparator(_pageWidth, _pageHeight);

            detector.setCleanUpSeparators(3);
            detector.setVipsBlock(_vipsBlocks);
            detector.setVisualBlocks(_visualBlocks);
            detector.detectVerticalSeparators();
            _verticalSeparators = detector.getVerticalSeparators();
            _verticalSeparators.sort(function(a, b) {
                return a.weight-b.weight
            });

            _visualStructure = new VisualStructure();
            _visualStructure.setId("1");
            _visualStructure.setNestedBlocks(_visualBlocks);
            _visualStructure.setWidth(_pageWidth);
            _visualStructure.setHeight(_pageHeight);

            for (var i = 0; i < _verticalSeparators.length; i++)
            {
                _verticalSeparators[i].setLeftUp(_verticalSeparators[i].startPoint, _visualStructure.getY());
                _verticalSeparators[i].setRightDown(_verticalSeparators[i].endPoint, _visualStructure.getY()+_visualStructure.getHeight());
            }

            constructWithVerticalSeparators(_visualStructure);
        }
        else
        {
            var listStructures = [];
            findListVisualStructures(_visualStructure, listStructures);

            for (var j = 0; j < listStructures.length; j++)
            {
                var detector = new VipsSeparator(_pageWidth, _pageHeight);

                detector.setCleanUpSeparators(4);

                detector.setVipsBlock(_vipsBlocks);
                detector.setVisualBlocks(listStructures[j].getNestedBlocks());
                detector.detectVerticalSeparators();
                _verticalSeparators = detector.getVerticalSeparators();

                for (var k = 0; k < _verticalSeparators.length; k++)
                {
                    _verticalSeparators[k].setLeftUp(_verticalSeparators[k].startPoint, listStructures[j].getY());
                    _verticalSeparators[k].setRightDown(_verticalSeparators[k].endPoint, listStructures[j].getY()+listStructures[j].getHeight());
                }

                constructWithVerticalSeparators(listStructures[j]);
            }
        }
    }

    /**
     * Performs actual constructing of visual structure with horizontal separators
     * @param actualStructure Actual visual structure
     */
    var constructWithHorizontalSeparators = function(actualStructure)
    {
        // if we have no visual blocks or separators
        if (actualStructure.getNestedBlocks().length == 0 || _horizontalSeparators.length == 0)
        {
            return;
        }

        var topVisualStructure = [];
        var bottomVisualStructure =  [];
        var nestedBlocks =  [];

        //construct children visual structures
        for (var i = 0; i < _horizontalSeparators.length; i++)
        {
            if (actualStructure.getChildrenVisualStructures().length == 0)
            {
                topVisualStructure.push(new VisualStructure());
                topVisualStructure[0].setX(actualStructure.getX());
                topVisualStructure[0].setY(actualStructure.getY());
                topVisualStructure[0].setHeight((_horizontalSeparators[i].startPoint-1)-actualStructure.getY());
                topVisualStructure[0].setWidth(actualStructure.getWidth());
                actualStructure.addChild(topVisualStructure.slice(0)[0]);

                bottomVisualStructure.push(new VisualStructure());
                bottomVisualStructure[0].setX(actualStructure.getX());
                bottomVisualStructure[0].setY(_horizontalSeparators[i].endPoint+1);
                bottomVisualStructure[0].setHeight((actualStructure.getHeight()+actualStructure.getY())-_horizontalSeparators[i].endPoint-1);
                bottomVisualStructure[0].setWidth(actualStructure.getWidth());
                actualStructure.addChild(bottomVisualStructure.slice(0)[0]);

                nestedBlocks = actualStructure.getNestedBlocks().slice(0);
            }
            else
            {
                var oldStructure = [];
                for (var j = 0; j < actualStructure.getChildrenVisualStructures().length; j++)
                {
                    if (_horizontalSeparators[i].startPoint >= actualStructure.getChildrenVisualStructures()[j].getY() &&
                            _horizontalSeparators[i].endPoint <= (actualStructure.getChildrenVisualStructures()[j].getY() + actualStructure.getChildrenVisualStructures()[j].getHeight()))
                    {
                        topVisualStructure.push(new VisualStructure());
                        topVisualStructure[0].setX(actualStructure.getChildrenVisualStructures()[j].getX());
                        topVisualStructure[0].setY(actualStructure.getChildrenVisualStructures()[j].getY());
                        topVisualStructure[0].setHeight((_horizontalSeparators[i].startPoint-1) - actualStructure.getChildrenVisualStructures()[j].getY());
                        topVisualStructure[0].setWidth(actualStructure.getChildrenVisualStructures()[j].getWidth());
                        var index = actualStructure.getChildrenVisualStructures().indexOf(actualStructure.getChildrenVisualStructures()[j]);
                        actualStructure.addChild(topVisualStructure.slice(0)[0]);

                        bottomVisualStructure.push(new VisualStructure());
                        bottomVisualStructure[0].setX(actualStructure.getChildrenVisualStructures()[j].getX());
                        bottomVisualStructure[0].setY(_horizontalSeparators[i].endPoint+1);
                        var height = (actualStructure.getChildrenVisualStructures()[j].getHeight()+actualStructure.getChildrenVisualStructures()[j].getY())-_horizontalSeparators[i].endPoint-1;
                        bottomVisualStructure[0].setHeight(height);
                        bottomVisualStructure[0].setWidth(actualStructure.getChildrenVisualStructures()[j].getWidth());
                        ////console.log(actualStructure.getChildrenVisualStructures());
                        actualStructure.addChild(bottomVisualStructure.slice(0)[0]);
                        ////console.log(actualStructure.getChildrenVisualStructures());

                        //!!!
                        oldStructure = actualStructure.getChildrenVisualStructures().slice(0);
                        break;
                    }
                }
                if (oldStructure[0] != null || oldStructure[0] != undefined)
                {
                    nestedBlocks = oldStructure[0].getNestedBlocks().slice(0);
                    actualStructure.getChildrenVisualStructures().splice(actualStructure.getChildrenVisualStructures().indexOf(oldStructure[0]),1);
                }
            }

            if (topVisualStructure[0] == null || bottomVisualStructure[0] == null || topVisualStructure[0] == undefined || bottomVisualStructure[0] == undefined)
                return;

            for (var k = 0; k < nestedBlocks.length; k++)
            {
                if ((nestedBlocks[k].getBox().getBoundingClientRect().top + $(window).scrollTop()) <= _horizontalSeparators[i].startPoint)
                    topVisualStructure[0].addNestedBlock(nestedBlocks[k]);
                else
                    bottomVisualStructure[0].addNestedBlock(nestedBlocks[k]);
            }

            topVisualStructure = [];
            bottomVisualStructure = [];
        }

        // set id for visual structures
        var iterator = 1;
        for (var l = 0; l < actualStructure.getChildrenVisualStructures().length; l++)
        {
            actualStructure.getChildrenVisualStructures()[l].setId(actualStructure.getId() + "-" + iterator);
            iterator++;
        }

        //remove all children separators
        for (var z = 0; z < actualStructure.getChildrenVisualStructures().length; z++)
        {
            ////console.log(actualStructure.getChildrenVisualStructures()[z].getId());
            actualStructure.getChildrenVisualStructures()[z].getHorizontalSeparators().length = 0;
            //////console.log(actualStructure.getChildrenVisualStructures()[z].getHorizontalSeparators());
        }

        //save all horizontal separators in my region
        actualStructure.addHorizontalSeparators(_horizontalSeparators);
    }

    /**
     * Performs actual constructing of visual structure with vertical separators
     * @param actualStructure Actual visual structure
     */
    var constructWithVerticalSeparators = function(actualStructure)
    {
        // if we have no visual blocks or separators
        if (actualStructure.getNestedBlocks().length == 0 || _verticalSeparators.length == 0)
        {
            return;
        }

        var leftVisualStructure = [];
        var rightVisualStructure = [];
        var nestedBlocks =  [];

        //construct children visual structures
        for (var i = 0; i < _verticalSeparators.length; i++)
        {
            if (actualStructure.getChildrenVisualStructures().length == 0)
            {
                leftVisualStructure.push(new VisualStructure());
                leftVisualStructure[0].setX(actualStructure.getX());
                leftVisualStructure[0].setY(actualStructure.getY());
                leftVisualStructure[0].setHeight(actualStructure.getHeight());
                leftVisualStructure[0].setWidth((_verticalSeparators[i].startPoint-1)-actualStructure.getX());
                actualStructure.addChild(leftVisualStructure.slice(0)[0]);

                rightVisualStructure.push(new VisualStructure());
                rightVisualStructure[0].setX(_verticalSeparators[i].endPoint+1);
                rightVisualStructure[0].setY(actualStructure.getY());
                rightVisualStructure[0].setHeight(actualStructure.getHeight());
                rightVisualStructure[0].setWidth((actualStructure.getWidth()+actualStructure.getX()) - _verticalSeparators[i].endPoint-1);
                actualStructure.addChild(rightVisualStructure[0]);

                nestedBlocks = actualStructure.getNestedBlocks().slice(0);
            }
            else
            {
                var oldStructure = [];
                for (var j = 0; j < actualStructure.getChildrenVisualStructures().length; j++)
                {
                    if (_verticalSeparators[i].startPoint >= actualStructure.getChildrenVisualStructures()[j].getX() &&
                            _verticalSeparators[i].endPoint <= (actualStructure.getChildrenVisualStructures()[j].getX() + actualStructure.getChildrenVisualStructures()[j].getWidth()))
                    {
                        leftVisualStructure.push(new VisualStructure());
                        leftVisualStructure[0].setX(actualStructure.getChildrenVisualStructures()[j].getX());
                        leftVisualStructure[0].setY(actualStructure.getChildrenVisualStructures()[j].getY());
                        leftVisualStructure[0].setHeight(actualStructure.getChildrenVisualStructures()[j].getHeight());
                        leftVisualStructure[0].setWidth((_verticalSeparators[i].startPoint-1)-actualStructure.getChildrenVisualStructures()[j].getX());
                        var index = actualStructure.getChildrenVisualStructures().indexOf(actualStructure.getChildrenVisualStructures()[j]);
                        actualStructure.addChild(leftVisualStructure.slice(0)[0]);

                        rightVisualStructure.push(new VisualStructure());
                        rightVisualStructure[0].setX(_verticalSeparators[i].endPoint+1);
                        rightVisualStructure[0].setY(actualStructure.getChildrenVisualStructures()[j].getY());
                        rightVisualStructure[0].setHeight(actualStructure.getChildrenVisualStructures()[j].getHeight());
                        var width = (actualStructure.getChildrenVisualStructures()[j].getWidth()+actualStructure.getChildrenVisualStructures()[j].getX())-_verticalSeparators[i].endPoint-1;
                        rightVisualStructure[0].setWidth(width);
                        actualStructure.addChild(rightVisualStructure.slice(0)[0]);

                        //!!!
                        oldStructure = actualStructure.getChildrenVisualStructures().slice(0);
                        //////console.log("hi");
                        //////console.log(actualStructure.getChildrenVisualStructures()[j]);
                        //////console.log(oldStructure);
                        break;
                    }
                }
                if (oldStructure[0] != null || oldStructure[0] != undefined)
                {
                    nestedBlocks = oldStructure[0].getNestedBlocks().slice(0);
                    actualStructure.getChildrenVisualStructures().splice(actualStructure.getChildrenVisualStructures().indexOf(oldStructure[0]),1);
                }
            }

            if (leftVisualStructure[0] == null || rightVisualStructure[0] == null || leftVisualStructure[0] == undefined || rightVisualStructure[0] == undefined)
                return;

            for (var k = 0; k < nestedBlocks.length; k++)
            {
                if (nestedBlocks[k].getBox().getBoundingClientRect().left + $(window).scrollLeft() <= _verticalSeparators[i].startPoint)
                    leftVisualStructure[0].addNestedBlock(nestedBlocks[k]);
                else
                    rightVisualStructure[0].addNestedBlock(nestedBlocks[k]);
            }

            leftVisualStructure = [];
            rightVisualStructure = [];
        }

        // set id for visual structures
        var iterator = 1;
        for (var l = 0; l < actualStructure.getChildrenVisualStructures().length; l++)
        {
            actualStructure.getChildrenVisualStructures()[l].setId(actualStructure.getId() + "-" + iterator);
            iterator++;
        }

        //remove all children separators
        for (var z = 0; z < actualStructure.getChildrenVisualStructures().length; z++)
        {
            actualStructure.getChildrenVisualStructures()[z].getVerticalSeparators().length = 0;
        }

        //save all horizontal separators in my region
        actualStructure.addVerticalSeparators(_verticalSeparators);
    }

    /**
     * @return Returns VipsBlocks structure with all blocks from page
     */
    this.getVipsBlocks = function()
    {
        return _vipsBlocks;
    }

    /**
     * @return Returns final visual structure
     */
    this.getVisualStructure = function()
    {
        return _visualStructure;
    }

    /**
     * Finds all visual blocks in VipsBlock structure
     * @param vipsBlock Actual VipsBlock
     * @param results   Results
     */
    var findVisualBlocks = function(vipsBlock, results)
    {
        if (vipsBlock.isVisualBlock() && !isTextNode(vipsBlock.getBox()))
            results.push(vipsBlock);

        for (var i = 0; i < vipsBlock.getChildren().length; i++)
        {
            findVisualBlocks(vipsBlock.getChildren()[i], results);
        }
    }

    /**
     * Sets VipsBlock structure and also finds and saves all visual blocks from its
     * @param vipsBlocks VipsBlock structure
     */
    this.setVipsBlocks = function(vipsBlocks)
    {
        _vipsBlocks = vipsBlocks;

        _visualBlocks.length = 0;
        findVisualBlocks(vipsBlocks, _visualBlocks);

    }

    /**
     * Returns all visual blocks in page
     * @return Visual Blocks
     */
    this.getVisualBlocks = function()
    {
        return _visualBlocks;
    }

    /**
     * Returns all horizontal separators detected on page
     * @return List of horizontal separators
     */
    this.getHorizontalSeparators = function()
    {
        return _horizontalSeparators;
    }

    /**
     * Sets horizontal separators to page
     * @param  horizontalSeparators List of horizontal separators
     */
    this.setHorizontalSeparator = function(horizontalSeparators)
    {
        _horizontalSeparators = horizontalSeparators;
    }

    /**
     * Returns all vertical separators detected on page
     * @return List of vertical separators
     */
    this.getVerticalSeparators = function()
    {
        return _verticalSeparators;
    }

    /**
     * Sets vertical separators to page
     * @param  verticalSeparators List of vertical separators
     */
    this.setVerticalSeparator = function(verticalSeparators)
    {
        _verticalSeparators = verticalSeparators;
    }

    /**
     * Sets vertical and horizontal separators to page
     * @param horizontalSeparators List of horizontal separators
     * @param verticalSeparators List of vertical separators
     */
    this.setSeparators = function(horizontalSeparators, verticalSeparators)
    {
        _verticalSeparators = verticalSeparators;
        _horizontalSeparators = horizontalSeparators;
    }

    /**
     * Finds list visual structures in visual structure tree
     * @param visualStructure Actual structure
     * @param results Results
     */
    var findListVisualStructures = function(visualStructure, results)
    {
        if (visualStructure.getChildrenVisualStructures().length == 0)
            results.push(visualStructure);

        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++) {
            findListVisualStructures(visualStructure.getChildrenVisualStructures()[i], results);
        }
    }

    /**
     * Replaces given old blocks with given new one
     * @param oldBlocks List of old blocks
     * @param newBlocks List of new blocks
     * @param actualStructure Actual Structure
     * @param pathStructures Path from structure to root of the structure
     */
    var replaceBlocksInPredecessors = function(oldBlocks, newBlocks, actualStructure, pathStructures)
    {
        for (var i = 0; i < actualStructure.getChildrenVisualStructures().length; i++)
        {
            replaceBlocksInPredecessors(oldBlocks, newBlocks, actualStructure.getChildrenVisualStructures()[i], pathStructures);
        }

        for (var j = 0; j < pathStructures.length; j++)
        {
            if (actualStructure.getId() == pathStructures[j])
            {
                var tempBlocks = actualStructure.getNestedBlocks().slice(0);

                //remove old blocks
                for (var k = 0; k < tempBlocks.length; k++)
                {
                    for (var l = 0; l < oldBlocks.length; l++)
                    {
                        if (tempBlocks[k] == oldBlocks[l])
                        {
                            actualStructure.getNestedBlocks().splice(actualStructure.getNestedBlocks().indexOf(tempBlocks[k]),1);
                        }
                    }
                }
                //add new blocks
                actualStructure.addNestedBlocks(newBlocks);
            }
        }
    }

    /**
     * Generates element's id's for elements that are on path
     * @param Path (Start visual strucure id)
     * @return List of id's
     */
    var generatePathStructures = function(path)
    {
        var pathStructures = [];

        var aaa = path.split("-");

        var tmp = "";

        for (var i = 0; i < aaa.length - 1; i++)
        {
            tmp += aaa[i];
            pathStructures.push(tmp);
            tmp += "-";
        }

        return pathStructures;
    }

    /**
     * Updates VipsBlock structure with the new one and also updates visual blocks on page
     * @param vipsBlocks New VipsBlock structure
     */
    this.updateVipsBlocks = function(vipsBlocks)
    {
        _vipsBlocks = vipsBlocks;

        _visualBlocks.length = 0;
        findVisualBlocks(vipsBlocks, _visualBlocks);
        //console.log(_visualBlocks);
        //console.log(_visualStructure.getChildrenVisualStructures().length);

        var listsVisualStructures = [];
        var oldNestedBlocks = [];
        findListVisualStructures(_visualStructure, listsVisualStructures);
        //console.log(listsVisualStructures.length);

        for (var d = 0; d < listsVisualStructures.length; d++) {
            ////console.log(listsVisualStructures[d].getNestedBlocks());
            if (listsVisualStructures[d].getNestedBlocks().length == 0)
                //console.log("this is null " + d);
                //continue;
            for (var f = 0; f < listsVisualStructures[d].getNestedBlocks().length; f++) {
                //console.log(d);
                //console.log(listsVisualStructures[d].getNestedBlocks()[f].getBox());
            }
        }

        for (var i = 0; i < listsVisualStructures.length; i++)
        {
            for (var m = 0; m < listsVisualStructures[i].getNestedBlocks().length; m++) {
                oldNestedBlocks.push(listsVisualStructures[i].getNestedBlocks()[m]);
            }
            listsVisualStructures[i].clearNestedBlocks();
            for (var j = 0; j < _visualBlocks.length; j++)
            {
                if ((_visualBlocks[j].getBox().getBoundingClientRect().left + $(window).scrollLeft()) >= listsVisualStructures[i].getX() &&
                        (_visualBlocks[j].getBox().getBoundingClientRect().left + $(window).scrollLeft()) <= (listsVisualStructures[i].getX() + listsVisualStructures[i].getWidth()))
                {
                    if ((_visualBlocks[j].getBox().getBoundingClientRect().top + $(window).scrollTop()) >= listsVisualStructures[i].getY() &&
                            (_visualBlocks[j].getBox().getBoundingClientRect().top + $(window).scrollTop()) <= (listsVisualStructures[i].getY() + listsVisualStructures[i].getHeight()))
                    {
                        if (_visualBlocks[j].getBox().offsetHeight != 0 && _visualBlocks[j].getBox().offsetWidth != 0)
                            listsVisualStructures[i].addNestedBlock(_visualBlocks[j]);
                    }
                }
            }
            if (listsVisualStructures[i].getNestedBlocks().length == 0)
            {
                listsVisualStructures[i].addNestedBlocks(oldNestedBlocks);
                for (var n = 0; n < oldNestedBlocks.length; n++) {
                    _visualBlocks.push(oldNestedBlocks[n]);
                }
            }

            var path = listsVisualStructures[i].getId();

            var pathStructures = generatePathStructures(path);

            replaceBlocksInPredecessors(oldNestedBlocks, listsVisualStructures[i].getNestedBlocks(), _visualStructure, pathStructures);

            oldNestedBlocks = [];
        }
    }

    /**
     * Sets order to visual structure
     * @param visualStructure
     */
    var setOrder = function(visualStructure)
    {
        visualStructure.setOrder(_srcOrder);
        _srcOrder++;

        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++)
            setOrder(visualStructure.getChildrenVisualStructures()[i]);
    }

    /**
     * Finds all horizontal and vertical separators in given structure
     * @param visualStructure Given structure
     * @param result Results
     */
    var getAllSeparators = function(visualStructure, result)
    {
        findAllHorizontalSeparators(visualStructure, result);
        findAllVerticalSeparators(visualStructure, result);
        removeDuplicates(result);
    }

    /**
     * Finds all horizontal separators in given structure
     * @param visualStructure Given structure
     * @param result Results
     */
    var getAllHorizontalSeparators = function(visualStructure, result)
    {
        findAllHorizontalSeparators(visualStructure, result);
        removeDuplicates(result);
    }

    /**
     * Finds all vertical separators in given structure
     * @param visualStructure Given structure
     * @param result Results
     */
    var getAllVerticalSeparators = function(visualStructure, result)
    {
        findAllVerticalSeparators(visualStructure, result);
        removeDuplicates(result);
    }

    /**
     * Finds all horizontal separators in given structure
     * @param visualStructure Given structure
     * @param result Results
     */
    var findAllHorizontalSeparators = function(visualStructure, result)
    {
        for(var i = 0; i < visualStructure.getHorizontalSeparators().length; i++) {
            result.push(visualStructure.getHorizontalSeparators()[i]);
        }

        for (var j = 0; j < visualStructure.getChildrenVisualStructures().length; j++)
        {
            findAllHorizontalSeparators(visualStructure.getChildrenVisualStructures()[j], result);
        }
    }

    /**
     * Finds all vertical separators in given structure
     * @param visualStructure Given structure
     * @param result Results
     */
    var findAllVerticalSeparators = function(visualStructure, result)
    {
        for(var i = 0; i < visualStructure.getVerticalSeparators().length; i++) {
            result.push(visualStructure.getVerticalSeparators()[i]);
        }

        for (var j = 0; j < visualStructure.getChildrenVisualStructures().length; j++)
        {
            findAllVerticalSeparators(visualStructure.getChildrenVisualStructures()[j], result);
        }
    }

    /**
     * Updates separators when replacing blocks
     * @param visualStructure Actual visual structure
     */
    var updateSeparatorsInStructure = function(visualStructure)
    {
        var adjacentBlocks = [];

        var allSeparators = [];
        allSeparators = visualStructure.getHorizontalSeparators().slice(0);

        // separator between blocks
        for (var i = 0; i < allSeparators.length; i++)
        {
            var aboveBottom = 0;
            var belowTop = _pageHeight;
            var above = null;
            var below = null;
            adjacentBlocks = [];

            for (var j = 0; j < visualStructure.getNestedBlocks(); j++)
            {
                var top = visualStructure.getNestedBlocks()[j].getBox().getBoundingClientRect().top + $(window).scrollTop();
                var bottom = visualStructure.getNestedBlocks()[j].getBox().getBoundingClientRect().top + $(window).scrollTop() + visualStructure.getNestedBlocks()[j].getBox().offsetHeight;

                if (bottom <= allSeparators[i].startPoint && bottom > aboveBottom)
                {
                    aboveBottom = bottom;
                    above = visualStructure.getNestedBlocks()[j];
                }

                if (top >= allSeparators[i].endPoint && top < belowTop)
                {
                    belowTop = top;
                    below = visualStructure.getNestedBlocks()[j];
                    adjacentBlocks.push(visualStructure.getNestedBlocks()[j]);
                }
            }

            if (above == null || below == null || above == undefined || below == undefined)
                continue;

            adjacentBlocks.push(above);
            adjacentBlocks.push(below);

            if (aboveBottom == allSeparators[i].startPoint - 1 && belowTop == allSeparators[i].endPoint + 1)
                continue;

            if (adjacentBlocks.length < 2)
                continue;

            var detector = new Separator(_pageWidth, _pageHeight);

            detector.setCleanUpSeparators(3);
            if (_iteration > 3)
                detector.setCleanUpSeparators(6);

            detector.setVisualBlocks(adjacentBlocks);
            detector.detectHorizontalSeparators();

            var tempSeparators = visualStructure.getHorizontalSeparators().slice(0);

            if (detector.getHorizontalSeparators().length == 0)
                continue;

            var newSeparator = Object.assign({}, detector.getHorizontalSeparators()[0]);
            newSeparator.setLeftUp(visualStructure.getX(), newSeparator.startPoint);
            newSeparator.setRightDown(visualStructure.getX()+visualStructure.getWidth(), newSeparator.endPoint);

            //remove all separators, that are included in block
            for (var k = 0; k < tempSeparators.length; k++)
            {
                if (tempSeparators[k] == allSeparators[i])
                {
                    visualStructure.getHorizontalSeparators()[visualStructure.getHorizontalSeparators().indexOf(tempSeparators[k])+1] = newSeparator;
                    visualStructure.getHorizontalSeparators().splice(visualStructure.getHorizontalSeparators().indexOf(tempSeparators[k]),1);
                    break;
                }
            }
        }

        // new blocks in separator
        for (var i = 0; i < allSeparators.length; i++)
        {
            var blockTop = _pageHeight;
            var blockDown = 0;
            adjacentBlocks = [];

            for (var j = 0; j < visualStructure.getNestedBlocks(); j++)
            {
                var top = visualStructure.getNestedBlocks()[j].getBox().getBoundingClientRect().top + $(window).scrollTop();
                var bottom = visualStructure.getNestedBlocks()[j].getBox().getBoundingClientRect().top + $(window).scrollTop() + visualStructure.getNestedBlocks()[j].getBox().offsetHeight;

                // block is inside the separator
                if (top > allSeparators[i].startPoint && bottom < allSeparators[i].endPoint)
                {
                    adjacentBlocks.push(visualStructure.getNestedBlocks()[j]);

                    if (top < blockTop)
                        blockTop = top;

                    if (bottom > blockDown)
                        blockDown = bottom;
                }
            }

            if (adjacentBlocks.length == 0)
                continue;

            var detector = new VipsSeparator(_pageWidth, _pageHeight);

            detector.setCleanUpSeparators(3);
            if (_iteration > 3)
                detector.setCleanUpSeparators(6);

            detector.setVisualBlocks(adjacentBlocks);
            detector.detectHorizontalSeparators();

            var tempSeparators = visualStructure.getHorizontalSeparators().slice(0);

            var newSeparators = [];

            var newSeparatorTop = new Separator(allSeparators[i].startPoint, blockTop - 1, allSeparators[i].weight);
            newSeparatorTop.setLeftUp(visualStructure.getX(), newSeparatorTop.startPoint);
            newSeparatorTop.setRightDown(visualStructure.getX()+visualStructure.getWidth(), newSeparatorTop.endPoint);

            newSeparators.push(newSeparatorTop);

            var newSeparatorBottom = new Separator(blockDown + 1, allSeparators[i].endPoint, allSeparators[i].weight);
            newSeparatorBottom.setLeftUp(visualStructure.getX(), newSeparatorBottom.startPoint);
            newSeparatorBottom.setRightDown(visualStructure.getX()+visualStructure.getWidth(), newSeparatorBottom.endPoint);

            if (detector.getHorizontalSeparators().length != 0)
            {
                for (var n = 0; n < detector.getHorizontalSeparators().length; n++) {
                    newSeparators.push(detector.getHorizontalSeparators()[n]);
                }
            }

            newSeparators.push(newSeparatorBottom);

            //remove all separators, that are included in block
            for (var k = 0; k < tempSeparators.length; k++)
            {
                if (tempSeparators[k] == allSeparators[i])
                {
                    test = newSeparators.slice(0);
                    for (var m = 0; m < newSeparators.length; m++) {
                        visualStructure.getHorizontalSeparators()[visualStructure.getHorizontalSeparators().indexOf(tempSeparators[k]) + 1 + m] = test[m];
                    }
                    visualStructure.getHorizontalSeparators().splice(visualStructure.getHorizontalSeparators().indexOf(tempSeparators[k]),1);
                    break;
                }
            }
        }
        for (var z = 0; z < visualStructure.getChildrenVisualStructures().length; z++)
        {
            updateSeparatorsInStructure(visualStructure.getChildrenVisualStructures()[z]);
        }
    }

    /**
     * Updates separators on whole page
     */
    var updateSeparators = function()
    {
        updateSeparatorsInStructure(_visualStructure);
    }

    /**
     * Removes duplicates from list of separators
     * @param separators
     */
    var removeDuplicates = function(separators)
    {
        var test = separators.slice(0);
        var dup = [];
        for (var i = 0; i < test.length; i++) {
            for (var j = 0; j < test.length; j++) {
                if (i == j) {
                    continue;
                }
                if (test[i].startPoint == test[j].startPoint && test[i].endPoint == test[j].endPoint) {
                    dup.push(test[j]);
                }
            }
        }
        //!!!
        for (var k = 0; k < dup.length; k++) {
            separators.splice(separators.indexOf(dup[k]),1);
        }
    }

    /**
     * Converts normalized weight of separator to DoC
     * @param Normalized weight of separator
     * @return DoC
     */
    var getDoCValue = function(value)
    {
        if (value == 0)
            return _maxDoC;

        return ((_maxDoC + 1) - value);
    }

    /**
     * Normalizes separators weights with linear normalization
     */
    this.normalizeSeparatorsSoftMax = function()
    {
        var separators = [];
        getAllSeparators(_visualStructure, separators);
        //!!!
        separators.sort(function(a, b) {
            return a.weight-b.weight
        });

        var stdev = getStdDeviation(separators);
        var meanValue = 0;
        var lambda = 3.0;
        var alpha = 1.0;

        for (var i = 0; i < separators.length; i++)
        {
            meanValue += separators[i].weight;
        }

        meanValue /= separators.length;

        for (var j = 0; j < separators.length; j++)
        {
            var normalizedValue = (separators[j].weight - meanValue) / (lambda * (stdev / (2 * Math.PI)));
            normalizedValue = 1 / (1 + Math.exp(-alpha * normalizedValue) + 1);
            normalizedValue = normalizedValue * (11 - 1) + 1;
            separators[j].normalizedWeight = getDoCValue(Math.round(normalizedValue));

            if (separators[j].weight == 3)
                separators[j].normalizedWeight = 11;
            /*          System.out.println(separator.startPoint + "\t" + separator.endPoint + "\t" +
                    (separator.endPoint - separator.startPoint + 1) +
                    "\t" + separator.weight + "\t" + separator.normalizedWeight +
                    "\t" + normalizedValue);*/
        }

        updateDoC(_visualStructure);

        _visualStructure.setDoC(1);
    }

    /**
     * Normalizes separators weights with linear normalization
     */
    this.normalizeSeparatorsMinMax = function()
    {
        var separators = [];

        getAllSeparators(_visualStructure, separators);

        var maxSep = new Separator(0, _pageHeight);
        separators.push(maxSep);
        maxSep.weight = 40;

        separators.sort(function(a, b) {
            return a.weight-b.weight
        });

        var minWeight = separators[0].weight;
        var maxWeight = separators[separators.length - 1].weight;

        for (var i = 0; i < separators.length; i++)
        {
            var normalizedValue = (separators[i].weight - minWeight) / (maxWeight - minWeight) * (11 - 1) + 1;
            separators[i].normalizedWeight = getDoCValue(Math.ceil(normalizedValue));
            /*      System.out.println(separator.startPoint + "\t" + separator.endPoint + "\t" +
                    (separator.endPoint - separator.startPoint + 1) +
                    "\t" + separator.weight + "\t" + separator.normalizedWeight +
                    "\t" + normalizedValue);*/
        }

        updateDoC(_visualStructure);

        _visualStructure.setDoC(1);
    }

    /**
     * Updates DoC of all visual structures nodes
     * @param visualStructure Visual Structure
     */
    var updateDoC = function(visualStructure)
    {
        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++)
        {
            updateDoC(visualStructure.getChildrenVisualStructures()[i]);
        }

        visualStructure.updateToNormalizedDoC(visualStructure);
    }

    /**
     * Finds minimal DoC in given structure
     * @param visualStructure
     */
    var findMinimalDoC = function(visualStructure)
    {
        if (parseInt(visualStructure.getId()) != 1)
        {
            if (visualStructure.getDoC() < _minDoC)
                _minDoC = visualStructure.getDoC();
        }

        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++)
        {
            findMinimalDoC(visualStructure.getChildrenVisualStructures()[i]);
        }
    }

    /**
     * Returns minimal DoC on page
     * @return Minimal DoC
     */
    this.getMinimalDoC = function()
    {
        _minDoC = 11;

        findMinimalDoC(_visualStructure);

        return _minDoC;
    }

    /**
     * Checks if it's necessary to continue in segmentation
     * @return True if it's necessary to continue in segmentation, otherwise false
     */
    this.continueInSegmentation = function()
    {
        getMinimalDoC();

        if (_pDoC < _minDoC)
            return false;

        return true;
    }

    /**
     * Counts standard deviation from list of separators
     * @param separators List of separators
     * @return Standard deviation
     */
    var getStdDeviation = function(separators)
    {
        var meanValue = 0.0;
        var stddev = 0.0;
        var deviations = [];
        var squaredDeviations = [];
        var sum = 0.0;

        for (var i = 0; i < separators.length; i++)
        {
            meanValue += separators[i].weight;
        }

        meanValue /= separators.length;

        for (var j = 0; j < separators.length; j++)
        {
            deviations.push((separators[j].weight - meanValue));
        }

        for (var k = 0; k < deviations.length; k++)
        {
            squaredDeviations.push((deviations[k] * deviations[k]));
        }

        for (var l = 0; l < squaredDeviations.length; l++)
        {
            sum += squaredDeviations[l];
        }

        stddev = Math.sqrt(sum/squaredDeviations.length);

        return stddev;
    }

    var isTextNode = function(el) {
        if (el.nodeType == 3) {
            return true;
        }
        else {
            return false;
        }
    }

    //##########################################################################
    // My interpretation
    this.construct_vs = function() {
        // this only run once during first iteration
        if (_visualStructure == null) {
            _visualStructure = new VisualStructure();
            _visualStructure.setId("1");
            _visualStructure.setNestedBlocks(_visualBlocks);
            _visualStructure.setWidth(_pageWidth);
            _visualStructure.setHeight(_pageHeight);

            // // detect separator
            // var detector = new VipsSeparator(_pageWidth, _pageHeight);

            // detector.setCleanUpSeparators(3);
            // detector.setVipsBlock(_vipsBlocks);
            // detector.setVisualBlocks(_visualBlocks);
            // detector.detectHorizontalSeparators();
            // detector.detectVerticalSeparators();
            // _verticalSeparators = detector.getVerticalSeparators();
            // _verticalSeparators.sort(function(a, b) {
            //     return a.weight-b.weight
            // });
            // _horizontalSeparators = detector.getHorizontalSeparators();
            // _horizontalSeparators.sort(function(a, b) {
            //     return a.weight-b.weight
            // });

            var temp = null;

            for (var i = 0; i < _visualBlocks.length; i++) {
                var yScroll = $(window).scrollTop();
                var blockStartY = _visualBlocks[i].getBox().getBoundingClientRect().top + yScroll;
                var blockEndY = _visualBlocks[i].getBox().getBoundingClientRect().bottom + yScroll;

                var xScroll = $(window).scrollLeft();
                var blockStartX = _visualBlocks[i].getBox().getBoundingClientRect().left + xScroll;
                var blockEndX = _visualBlocks[i].getBox().getBoundingClientRect().right + xScroll;

                temp = new VisualStructure();
                temp.setStartY(blockStartY);
                temp.setEndY(blockEndY);
                temp.setStartX(blockStartX);
                temp.setEndX(blockEndX);
                temp.addNestedBlock(_visualBlocks[i]);

                _visualStructure.addChild(temp);

                temp = null;
            }

            var iterator = 1;
            for (var i = 0; i < _visualStructure.getChildrenVisualStructures().length; i++) {
                if (_debug == 1) {
                    console.log(_visualStructure.getChildrenVisualStructures()[i].getNestedBlocks()[0].getBox());
                }
                _visualStructure.getChildrenVisualStructures()[i].setId(_visualStructure.getId() + "-" + iterator);
                if (_debug == 1) {
                    console.log(_visualStructure.getChildrenVisualStructures()[i].getId());
                }
                iterator++;
            }
        }

        // for later iteration
        else {
            //console.log(_visualBlocks);
            var temp = null;

            for (var i = 0; i < _visualBlocks.length; i++) {

                //check if block is in existing visual structure
                var existed = false;
                var temp_list = [];
                findAllListVisualStructures(_visualStructure,temp_list);
      
                for (var z = 0; z < temp_list.length; z++) {
                    for (var n = 0; n < temp_list[z].getNestedBlocks().length; n++) {
                        if (temp_list[z].getNestedBlocks()[n].getBox() == _visualBlocks[i].getBox()) {
                            existed = true;
                            break;
                        }
                    }
                }
                if (existed) {
                    continue;
                }

                // Get block position
                var yScroll = $(window).scrollTop();
                var blockStartY = _visualBlocks[i].getBox().getBoundingClientRect().top + yScroll;
                var blockEndY = _visualBlocks[i].getBox().getBoundingClientRect().bottom + yScroll;

                var xScroll = $(window).scrollLeft();
                var blockStartX = _visualBlocks[i].getBox().getBoundingClientRect().left + xScroll;
                var blockEndX = _visualBlocks[i].getBox().getBoundingClientRect().right + xScroll;

                // Get best matched visual structure index for the block, if it exist
                var index = find_vs(_visualBlocks[i],temp_list);
                ////console.log(index);

                if (index == -1) {
                    //console.log("==========Check ME==========");
                    temp = new VisualStructure();
                    temp.setStartY(blockStartY);
                    temp.setEndY(blockEndY);
                    temp.setStartX(blockStartX);
                    temp.setEndX(blockEndX);
                    temp.addNestedBlock(_visualBlocks[i]);
                    _visualStructure.addChild(temp);

                    temp = null;

                }

                else {
                    temp = new VisualStructure();
                    temp.setStartY(blockStartY);
                    temp.setEndY(blockEndY);
                    temp.setStartX(blockStartX);
                    temp.setEndX(blockEndX);
                    temp.addNestedBlock(_visualBlocks[i]);
                    ////console.log(temp_list[index].getChildrenVisualStructures());
                    temp_list[index].addChild(temp);
                    ////console.log(temp_list[index].getChildrenVisualStructures());

                    temp = null; 
                }

            }

            temp_list = [];
            findAllListVisualStructures(_visualStructure,temp_list);
            ////console.log(temp_list);
            for (var i = 0; i < temp_list.length; i++) {
                var iterator = 1;
                for (var j = 0; j < temp_list[i].getChildrenVisualStructures().length; j++) {
                    if (_debug == 1) {
                        console.log(temp_list[i].getChildrenVisualStructures()[j].getNestedBlocks()[0].getBox());
                    }
                    if (temp_list[i].getChildrenVisualStructures()[j].getId != "") {
                        temp_list[i].getChildrenVisualStructures()[j].setId(temp_list[i].getId() + "-" + iterator);
                        iterator++;
                    }
                    if (_debug == 1) {
                        console.log(temp_list[i].getChildrenVisualStructures()[j].getId());
                    }
                }
            }
        }
    }

    var find_vs = function(block,vslist) {
        // Get block position
        var yScroll = $(window).scrollTop();
        var blockStartY = block.getBox().getBoundingClientRect().top + yScroll;
        var blockEndY = block.getBox().getBoundingClientRect().bottom + yScroll;

        ////console.log(blockStartY);
        ////console.log(blockEndY);

        var xScroll = $(window).scrollLeft();
        var blockStartX = block.getBox().getBoundingClientRect().left + xScroll;
        var blockEndX = block.getBox().getBoundingClientRect().right + xScroll;

        ////console.log(blockStartX);
        ////console.log(blockEndX);


        var min = -1;

        for (var i = 0; i < vslist.length; i++) {
            ////console.log("@@@@@@@@@@@@@@");
            ////console.log(vslist[i].getStartY);
            ////console.log(vslist[i].getEndY);
            ////console.log(vslist[i].getStartX);
            ////console.log(vslist[i].getEndX);
            ////console.log("@@@@@@@@@@@@@@");
            if (blockStartY >= vslist[i].getStartY() && blockStartX >= vslist[i].getStartX() &&
                blockEndY <= vslist[i].getEndY() && blockEndX <= vslist[i].getEndX()) {
                if (min == -1) {
                    min = i;
                }
                else {
                    if ((blockStartY - vslist[min].getStartY() >= blockStartY - vslist[i].getStartY()) &&
                        (blockStartX - vslist[min].getStartX() >= blockStartX - vslist[i].getStartX()) &&
                        (vslist[min].getEndY() - blockEndY >= vslist[i].getEndY() - blockEndY) &&
                        (vslist[min].getEndX() - blockEndX >= vslist[i].getEndX() - blockEndX)) {
                        min = i;
                    }
                }
            }
        }

        return min;
    }

    var findAllListVisualStructures = function(visualStructure, results)
    {
        results.push(visualStructure);

        for (var i = 0; i < visualStructure.getChildrenVisualStructures().length; i++) {
            findAllListVisualStructures(visualStructure.getChildrenVisualStructures()[i], results);
        }
    }

    this.getAllListVisualStructures = function() {
        var res = [];

        findAllListVisualStructures(_visualStructure,res);

        return res;
    }
}

