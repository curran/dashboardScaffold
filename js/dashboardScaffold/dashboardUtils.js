/**
 * A mini-framework for layout of visualization dashboards.
 *
 * TODO test removing a visualization from the layout
 * (perhaps d3 exit needs to be added to layour divs)
 */
define(['d3', 'underscore', './dashboardLayout'],
    function(d3, _, dashboardLayout){
  var config, visualizations = {};
  function options(d){
    return config.visualizations[d.name];
  }
  return {
    createDashboard: function(dashboardId){
      function update(){
        var visDivs = d3.select('#'+dashboardId).selectAll('.vis')
        // The call to dashboardLayout() computes the (x, y, dx, dy) positions.
          .data(dashboardLayout(config.layout, config.visualizations));

        // Enter (creates DOM elements, happens on first call)
        visDivs.enter().append('div')
          .attr('class', 'vis')
          .style('position', 'absolute')
          .select(function(d){
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
            var vis = visualizations[d.name];
            var div = this;
            if(vis && (vis != 'loading')){
              vis.update(options(d));
            }
            else{
              visualizations[d.name] = 'loading';
              // This call loads the JS dynamically
              require([options(d).module], function(visFactory){
                vis = visFactory(div);
                visualizations[d.name] = vis;
                vis.update(options(d));
              });
            }
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
          //var visDivs = d3.select('#'+dashboardId).selectAll('.vis')
          //  .data([]).exit().remove();
          update();
        }
      };
    }
  };
});
