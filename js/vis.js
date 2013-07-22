/**
 * A dummy visualization to show how D3 visualizations
 * can work within the dashboard layout framework.
 */
define(['d3'], function(d3){
  return function(){
    var domElement = document.createElement('div');
    var svg = d3.select(domElement).append('svg');
    var rect = svg.append('rect');
    var label = svg.append('text');
    var options;
    return {
      domElement: domElement,
      setOptions: function(newOptions){
        options = newOptions;
      },
      update: function(width, height){
        rect
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', options.color);

        label
          .attr('x', width / 2)
          .attr('y', height / 2)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.5em')
          .style('font-size', options.fontSize)
          .text(options.text);
      }
    }
  }
});
