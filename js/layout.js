/**
 * A simple layout algorithm for nested boxes that uses D3 conventions.
 */
define(['underscore'], function(_){
  return function(root, visOptions){
    var leaves = [];
    function hidden(node){
      var options = visOptions[node.name];
      if(options){ return options.hidden; }
      else{ return childrenAreHidden(node); }
    }
    function childrenAreHidden(node){
      if(node.children){
        return _.every(node.children, function(child){
          var options = visOptions[child.name];
          if(options){ return options.hidden; }
          else { return false; }
        });
      }
      else{
        return false;
      }
    }
    function innerLayout(node, x, y, dx, dy){
      var totalSize = 0, i, child,
          childX, childY, childDx, childDy;
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
            childX = x;
            childY = y;
            childDx = childDx;
            childDy = dy;
            x += childDx;
          }
          else if(node.orientation == 'vertical'){
            childDy = dy * child.size / totalSize;
            childX = x;
            childY = y;
            childDx = dx;
            childDy = childDy;
            y += childDy;
          }
        }
        if(child.children){
          innerLayout(child, childX, childY, childDx, childDy);
        }
        else{
          leaves.push({
            d: child,
            x: childX,
            y: childY,
            dx: childDx,
            dy: childDy
          });
        }
      }
    }
    innerLayout(root, 0, 0, 100, 100);
    return leaves;
  };
});
