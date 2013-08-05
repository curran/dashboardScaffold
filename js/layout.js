/*global define */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"

/**
 * A simple layout algorithm for nested boxes that uses D3 conventions.
 */
define(['underscore'], function (_) {
    "use strict";
    return function (root, visOptions) {
        var leaves = [];
        function childrenAreHidden(node) {
            if (node.children) {
                return _.every(node.children, function (child) {
                    var options = visOptions[child.name];
                    if (options) { return options.hidden; }
                    return false;
                });
            }
            return false;
        }
        function hidden(node) {
            var options = visOptions[node.name];
            if (options) {
                return options.hidden;
            }
            return childrenAreHidden(node);
        }
        function innerLayout(node, x, y, dx, dy) {
            var totalSize = 0, i,
                childX, childY, childDx, childDy;
            _.each(node.children, function (child) {
                if (!hidden(child)) {
                    totalSize += child.size;
                }
            });
            _.each(node.children, function (child) {
                if (!hidden(child)) {
                    if (node.orientation === 'horizontal') {
                        childDx = dx * child.size / totalSize;
                        childX = x;
                        childY = y;
                        childDy = dy;
                        x += childDx;
                    } else if (node.orientation === 'vertical') {
                        childDy = dy * child.size / totalSize;
                        childX = x;
                        childY = y;
                        childDx = dx;
                        y += childDy;
                    }
                }

                if (child.children) {
                    innerLayout(child, childX, childY, childDx, childDy);
                } else {
                    leaves.push({
                        d: child,
                        x: childX,
                        y: childY,
                        dx: childDx,
                        dy: childDy
                    });
                }
            });
        }
        innerLayout(root, 0, 0, 100, 100);
        return leaves;
    };
});
