/**
 * A simple layout algorithm for nested boxes that uses D3 conventions.
 *
 * Each node of the input data is expected to have the following properties:
 *
 *  * 'size' (Number) The size weight of this node.
 *  * 'children' The nodes that will be nested.
 *  * 'orientation' (either 'horizontal' or 'vertical')
 *    Determines whether children are place left-right or top-bottom.
 *    Only necessary if 'children' has a value.
 */
define([], function(){
  return function(root, visOptions){
    var leaves = [];
    function hidden(node){
      var options = visOptions[node.name];
      if(options){ return options.hidden; }
      else{ return false; }
    }
    function innerLayout(node, x, y, dx, dy){
      var totalSize = 0, i, child, childDx, childDy;
      for(i = 0; i < node.children.length; i++){
        child = node.children[i];
        if(!hidden(child)){
          totalSize += child.size;
        }
      }
      for(i = 0; i < node.children.length; i++){
        child = node.children[i];
        if(!hidden(child)){
          if(node.orientation == 'horizontal'){
            childDx = dx * child.size / totalSize;
            child.x = x;
            child.y = y;
            child.dx = childDx;
            child.dy = dy;
            x += childDx;
          }
          else if(node.orientation == 'vertical'){
            childDy = dy * child.size / totalSize;
            child.x = x;
            child.y = y;
            child.dx = dx;
            child.dy = childDy;
            y += childDy;
          }
        }
        if(child.children){
          innerLayout(child, child.x, child.y, child.dx, child.dy);
        }
        else{
          leaves.push(child);
        }
      }
    }
    innerLayout(root, 0, 0, 100, 100);
    return leaves;
  };
});
