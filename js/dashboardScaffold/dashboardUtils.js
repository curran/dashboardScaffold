/**
 * A mini-framework for layout of visualization dashboards.
 *
 * TODO test removing a visualization from the layout
 * (perhaps d3 exit() needs to be added to layout divs)
 */
define(['d3', 'underscore', './dashboardLayout'],
    function(d3, _, dashboardLayout){
  var config, visualizations = {};
  function options(d){
    return config.visualizations[d.name];
  }

  function updateVis(vis, div, d){
    var s = window.getComputedStyle(div),
        width  = Math.ceil(parseFloat(s.width)),
        height = Math.ceil(parseFloat(s.height)),
        divContainsVis = div.hasChildNodes() && (div.lastChild === vis.domElement);

    // Alert developers when a vis does not expose a DOM element.
    if(!vis.domElement){
      throw Error('The visualization named "'+d.name+
        '" is missing the required "domElement" property.');
    }

    // This handles the case where a visualization in the layout has been
    // removed, and the existing DOM elements need to be cleared out and have
    // the correct visualizations injected into them.
    if(!divContainsVis){
      if(div.hasChildNodes()){
        div.removeChild(div.lastChild);
      }
      div.appendChild(vis.domElement);
    }

    vis.setOptions(options(d), width, height);
    vis.update();
  }
  return {
    createDashboard: function(dashboardId){
      function update(){
        // The call to dashboardLayout() computes the (x, y, dx, dy) positions.
        var data = dashboardLayout(config.layout, config.visualizations);
        var visDivs = d3.select('#'+dashboardId).selectAll('.vis').data(data);

        // Enter (creates DOM elements, happens on first call)
        visDivs.enter().append('div')
          .attr('class', 'vis')
          .style('position', 'absolute');

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
              updateVis(vis, div, d);
            }
            else{
              visualizations[d.name] = 'loading';

              // This call loads the JS dynamically
              require([options(d).module], function(visFactory){
                vis = visFactory();
                visualizations[d.name] = vis;
                updateVis(vis, div, d);
              });
            }
          });

        visDivs.exit().remove();

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
          update();
        }
      };
    }
  };
});
