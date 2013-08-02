/**
 * A mini-framework for layout of visualization dashboards.
 */
define(['d3', 'underscore', 'backbone', './layout'],
    function(d3, _, Backbone, layout){
  var config, visualizations = {};

  // Gets the options for a given visualization
  function getOptions(d){
    return config.visualizations[d.name];
  }

  // Returns whether or not the visualization with
  // the given name is hidden or not.
  function hidden(name){
    return config.visualizations[name].hidden;
  }

  // Gets the CSS-computed size of a given div
  function getSize(div){
    var s = window.getComputedStyle(div),
        borderWidth = parseInt(s.borderWidth),
        width  = Math.ceil(parseFloat(s.width)) - borderWidth,
        height = Math.ceil(parseFloat(s.height)) - borderWidth;
    return {width: width, height: height};
  }

  function updateVis(vis, div, d){
    var options = _.extend(getOptions(d), getSize(div)),
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

    setOptions(vis, options);
  }

  // Calls setters to set changed options.
  // No calls are made for unchanged options.
  function setOptions(vis, options){
    var chart = vis.chart,
        keysToConsider = _.intersection(
          _.keys(options), _.keys(chart)
        ),
        keysToSet = _.filter(keysToConsider, function(key){
          // use stringify to account for nested objects
          var newValue = JSON.stringify(options[key]),
              oldValue = JSON.stringify(chart[key]());
          return newValue != oldValue;
        });
    _.each(keysToSet, function(key){
      chart[key](options[key]);
    });
  }

  return {
    createDashboard: function(dashboardId){
      var dashboard;

      // Sets an option for a given visualization in the config
      // (propagates changes from vis to config)
      function setOption(name, property, value){
        config.visualizations[name][property] = value;
        dashboard.trigger('configChanged', config);
        // Trigger event that resets CodeMirror Text to serialized JSON
      }

      function update(){
        // The call to layout() computes the (x, y, dx, dy) positions.
        var data = layout(config.layout, config.visualizations);
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
          .style('height', function(d){
            // Return 0 height when hidden in order to prevent 
            // brush interactions from changing the cursor
            if(hidden(d.d.name))
              return 0;
            else
              return d.dy+'%';
          })
          .style('visibility', function(d){
            return hidden(d.d.name) ? 'hidden' : 'visible'
          })
          .select(function(d){
            d = d.d; //unpack the inner component from the layout
            var vis = visualizations[d.name];
            var div = this;

            if(vis && (vis != 'loading')){
              updateVis(vis, div, d);
            }
            else{
              if(vis != 'loading'){
                visualizations[d.name] = 'loading';

                // This call loads the JS dynamically
                require([getOptions(d).module], function(visFactory){
                  vis = visFactory();
                  visualizations[d.name] = vis;
                  listenForChanges(d.name, vis.chart);
                  updateVis(vis, div, d);
                });
              }
            }
          });

        visDivs.exit().remove();

        // Apply CSS styles from the configig file to each visualization div.
        _.each(_.pairs(config.visDivCSS), function(pair){
          visDivs.style(pair[0], pair[1]);
        });
      }

      function listenForChanges(name, chart){
        _.each(_.pairs(chart), function(pair){
          var property = pair[0],
              getterSetter = pair[1];
          getterSetter.on('change', function(value){
            setOption(name, property, value);
          });
        });
      }

      // Call update() once to initialize the layout
      if(config)
        update();

      dashboard = {
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
      _.extend(dashboard, Backbone.Events);
      return dashboard;
    }
  };
});
//TODO split this file up, it is too big
