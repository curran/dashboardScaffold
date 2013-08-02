/**
 * A dummy visualization to show how D3 visualizations
 * can work within the dashboard layout framework.
 */
define(['d3', 'underscore', 'getterSetters'], function(d3, _, getterSetters){
  return function(){
    var div = document.createElement('div'),
        options = {
          bkgColor: '#005E47',
          lineColor: '#000000',
          lineWidth: 5,
          labelSize: '20px',
          labelText: '',
          width: 0,
          height: 0
        };

    function svg(){
      var svg = d3.select(div).selectAll('svg').data([1]);
      svg.enter().append('svg');
      svg.attr('width', options.width)
         .attr('height', options.height);
      return svg;
    }

    function randomColor(){
      var r = Math.round(Math.random() * 255),
          g = Math.round(Math.random() * 255),
          b = Math.round(Math.random() * 255);
      return 'rgb('+r+','+g+','+b+')';
    }

    var updateRect = _.debounce(function(){
      console.log('in updateRect');
      var rect = svg().selectAll('rect').data([1]);
      rect.enter().append('rect')
        .on('click', function(){
          my.bkgColor(randomColor());
        });
      rect
        .attr('x', 0)
        .attr('y', 0) 
        .attr('width', options.width)
        .attr('height', options.height)
        .attr('fill', options.bkgColor);
    }, 0);

    var updateLines = _.debounce(function(){
      console.log('in updateLines');
      var w = options.width,
          h = options.height,
          lines = svg().selectAll('line').data([
            {x1: 0, y1: 0, x2: w, y2: h},
            {x1: 0, y1: h, x2: w, y2: 0}
          ]),
          x1,
          width1,
          drag = d3.behavior.drag()
            .on('dragstart', function(d){
              x1 = d3.event.sourceEvent.pageX;
            })
            .on('drag', function(d){
              var x2 = d3.event.sourceEvent.pageX,
                  newLineWidth = my.lineWidth() + x2 - x1;
              newLineWidth = newLineWidth < 1 ? 1 : newLineWidth;
              my.lineWidth(newLineWidth);
              x1 = x2
            });

      lines.enter().append('line')
        .on('click', function(){
          my.lineColor(randomColor());
        });




      lines
        .attr('x1', function(d){ return d.x1; })
        .attr('y1', function(d){ return d.y1; })
        .attr('x2', function(d){ return d.x2; })
        .attr('y2', function(d){ return d.y2; })
        .style('stroke', options.lineColor)
        .style('stroke-width', options.lineWidth)
        .call(drag);
    }, 0);

    var updateLabel = _.debounce(function(){
      console.log('in updateLabel');
      var label = svg().selectAll('text').data([1]);
      label.enter().append('text');
      label
        .attr('x', options.width / 2)
        .attr('y', options.height / 2)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.5em')
        .style('font-size', options.labelSize)
        .text(options.labelText);
    }, 0);

    // See http://bost.ocks.org/mike/chart/
    function my(){
      console.log('in my');
      updateRect();
      updateLines();
      updateLabel();
    }
    
    _.extend(my, getterSetters(options));

    my.width.on('change', my);
    my.height.on('change', my);
    my.bkgColor.on('change', updateRect);
    my.lineColor.on('change', updateLines);
    my.lineWidth.on('change', updateLines);
    my.labelText.on('change', updateLabel);
    my.labelSize.on('change', updateLabel);

    return {
      domElement: div,
      chart: my
    }
  }
});
