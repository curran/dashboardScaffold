/**
 * A mini-framework for layout of visualization dashboards.
 */
define(['d3', 'underscore', './dashboardLayout'],
    function(d3, _, dashboardLayout){
  return {
    createDashboard: function(config){
      function update(){
        var visDivs = d3.select('#'+config.dashboardDivId).selectAll('.vis')
        // The call to dashboardLayout() computes the (x, y, dx, dy) positions.
          .data(dashboardLayout(config.layout, config.visualizations));

        // Enter (creates DOM elements, happens on first call)
        visDivs.enter().append('div')
          .attr('class', 'vis')
          .style('position', 'absolute')
          .select(function(d){
            var div = this;
            var options = config.visualizations[d.name];
            // This call loads the JS dynamically
            require([options.module], function(visFactory){
              var visualization = visFactory(div, options);
              visualization.update();
              d.visualization = visualization;
            });
          });

        // Update (changes DOM element properties, happens each call)
        visDivs
          .style('top',    function(d){ return d.y+'%'; })
          .style('left',   function(d){ return d.x+'%'; })
          .style('width',  function(d){ return d.dx+'%'; })
          .style('height', function(d){ return d.dy+'%'; })
          .style('visibility', function(d){
            var hidden = config.visualizations[d.name].hidden;
            return hidden ? 'hidden' : 'visible'
          })
          .select(function(d){
            if(d.visualization) // If the visualization is loaded,
              d.visualization.update(); // update its size.
          });

        // Apply CSS styles from the configig file to each visualization div.
        _.each(_.pairs(config.visDivCSS), function(pair){
          visDivs.style(pair[0], pair[1]);
        });
      }

      // Call update() once to initialize the layout
      if(config)
        update();

      return {
        update: update,
        showHideVis: function(visName, visible){
          config.visualizations[visName].hidden = !visible;
          update();
        },
        setConfig: function(newConfig){
          config = newConfig;
          // Clear out the DOM so the visualizations are re-initialized
          // (there may be a memory leak with this approach..)
          var visDivs = d3.select('#'+config.dashboardDivId).selectAll('.vis')
            .data([]).exit().remove();
          update();
        }
      };
    }
  };
});
