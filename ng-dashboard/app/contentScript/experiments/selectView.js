/*
sub-tree containing at least 70% of nodes “box” selected by default to aid in extraction

DFS will be used to calculate how many children are contained in a subtree.
Next, 4 extreme coordinates of this subtree will define the box selection
*/

sizeOfSubtree = Array(globalBlocks.length).fill(1); // array of size of sub-tree with node as its root

/*
 *
 */
function getDefaultView(percentage) {
    var threshold = percentage * globalBlocks.length / 100;
    for (var i = globalBlocks.length - 1; i >= 0; i--) {
        +its own value to immediate parent
        get parent
        sizeOfSubtree[parent] += sizeOfSubtree[i]
    }
}

if hasChildren recurse on all children
if no child then return 1
sum values returned by all children + 1
if sum greater than equal to threshold break and return


do it recursively. just check if value set then just return

for all globalBlocks but from opposite end
    add up 1 + Size of children's subtrees from memoized structure
    return when sum exceeds threshold

sizeOfSubtree
    check in memoized array
    if not found recurse
    fill memoized array
    if greater than threshold return

for all globalBlocks
    sum = 1 + sizeOfSubtree for all children
    if sum >= threshold
        set default view
        break from for loops

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