/*global define, window */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"

/**
 * A mini-framework for layout of visualization dashboards.
 */
define(['d3', 'underscore', 'backbone', 'async', './layout'], function (d3, _, Backbone, async, layout) {
    "use strict";
    var config, visualizations = {};

    // Gets the options for a given visualization
    function getOptions(d) {
        return config.visualizations[d.name];
    }

    // Returns whether or not the visualization with
    // the given name is hidden or not.
    function hidden(name) {
        return config.visualizations[name].hidden;
    }

    // Gets the CSS-computed size of a given div
    function getSize(div) {
        var s = window.getComputedStyle(div),
            borderWidth = parseInt(s.borderWidth, 10),
            width  = Math.ceil(parseFloat(s.width)) - borderWidth,
            height = Math.ceil(parseFloat(s.height)) - borderWidth;
        return {width: width, height: height};
    }

    // Calls setters to set changed options.
    // No calls are made for unchanged options.
    function setOptions(vis, options) {
        var chart = vis.chart,
            keys = _.intersection(_.keys(options), _.keys(chart));

            //console.log("setting "+key+" : "+options[key]);
        keys = _(keys).filter(function (key) {
            // use stringify to account for nested objects
            var newValue = JSON.stringify(options[key]),
                oldValue = JSON.stringify(chart[key]());
            return newValue !== oldValue;
        });
        _.each(keys, function (key) {
            chart[key](options[key]);
        });
    }

    function updateVis(vis, div, options) {
        var size, divContainsVis;

        if (div) {
            size = getSize(div);
            divContainsVis = div.hasChildNodes() && (div.lastChild === vis.domElement);

            // Alert developers when a vis does not expose a DOM element.
            if (!vis.domElement) {
                throw new Error('The visualization with options "' +
                    JSON.stringify(options) +
                    '" was placed in the dashboard layout, but is missing' +
                    'the required "domElement" property.');
            }

            // This handles the case where a visualization in the layout has been
            // removed, and the existing DOM elements need to be cleared out and have
            // the correct visualizations injected into them.
            if (!divContainsVis) {
                if (div.hasChildNodes()) {
                    div.removeChild(div.lastChild);
                }
                div.appendChild(vis.domElement);
            }
            setOptions(vis, size);
        }
        setOptions(vis, options);
    }

    return {
        createDashboard: function (dashboardId, visModulePath) {
            console.log(visModulePath);
            var dashboard;

            // Sets an option for a given visualization in the config
            // (propagates changes from vis to config)
            function setOption(name, property, value) {
                config.visualizations[name][property] = value;
                dashboard.trigger('configChanged', config);
                // Trigger event that resets CodeMirror Text to serialized JSON
            }

            function listenForChanges(name, chart) {
                _.each(_.pairs(chart), function (pair) {
                    var property = pair[0],
                        getterSetter = pair[1];
                    if (property !== 'width' && property !== 'height') {
                        getterSetter.on('change', function (value) {
                            setOption(name, property, value);
                        });
                    }
                    if (property === 'hidden') {
                        // recompute the layout when visualizations
                        // are shown or hidden
                        getterSetter.on('change', update);
                    }
                });
            }

            // This function is passed into visualization factories
            // inorder to give them access to the other visualizations.
            // callback(vis) where vis has vis.chart and vis.domElement
            function getVisualization(name, callback) {
                async.whilst(
                    function () { return visualizations[name] === 'loading'; },
                    function (checkAgain) { setTimeout(checkAgain, 100); },
                    function () { callback(visualizations[name]); }
                );
            }

            function update() {
                // The call to layout() computes the (x, y, dx, dy) positions.
                var data = layout(config.layout, config.visualizations),
                    visDivs = d3.select('#' + dashboardId).selectAll('.vis').data(data);

                // Enter (creates DOM elements, happens on first call)
                visDivs.enter().append('div')
                    .attr('class', 'vis')
                    .style('position', 'absolute');

                // Update (changes DOM element properties, happens each call)
                visDivs
                    .style('top',    function (d) { return d.y + '%'; })
                    .style('left',   function (d) { return d.x + '%'; })
                    .style('width',  function (d) { return d.dx + '%'; })
                    .style('height', function (d) {
                        // Return 0 height when hidden in order to prevent 
                        // brush interactions from changing the cursor
                        if (hidden(d.d.name)) {
                            return 0;
                        }
                        return d.dy + '%';
                    })
                    .style('visibility', function (d) {
                        return hidden(d.d.name) ? 'hidden' : 'visible';
                    })
                    .select(function (d) {
                        var vis = visualizations[d.d.name],
                            div = this;

                        d = d.d; //unpack the inner component from the layout

                        if (vis && (vis !== 'loading')) {
                            updateVis(vis, div, getOptions(d));
                        } else {
                            if (vis !== 'loading') {
                                visualizations[d.name] = 'loading';

                                // This call loads the JS dynamically
                                require([visModulePath + getOptions(d).module], function (visFactory) {
                                    vis = visFactory(getVisualization);
                                    visualizations[d.name] = vis;
                                    updateVis(vis, div, getOptions(d));
                                    listenForChanges(d.name, vis.chart);
                                });
                            }
                        }
                    });

                visDivs.exit().remove();

                // Apply CSS styles from the confige to each visualization div.
                _.each(_.pairs(config.visDivCSS), function (pair) {
                    visDivs.style(pair[0], pair[1]);
                });

                // Initialize the components that are not in the layout
                _.each(_.pairs(config.visualizations), function (pair) {
                    var name = pair[0],
                        options = pair[1],
                        vis = visualizations[name];

                    if (!vis) {
                        visualizations[name] = 'loading';

                        // This call loads the JS dynamically
                        require([visModulePath + options.module], function (visFactory) {
                            vis = visFactory(getVisualization);
                            visualizations[name] = vis;
                            updateVis(vis, null, options);
                            listenForChanges(name, vis.chart);
                        });
                    } else {
                        // update components not in the layout
                        if (options.invisible) {
                            updateVis(vis, null, options);
                        }
                    }
                });
            }

            // Call update() once to initialize the layout
            if (config) {
                update();
            }

            dashboard = {
                update: update,
                showHideVis: function (visName, visible) {
                    config.visualizations[visName].hidden = !visible;
                    update();
                },
                setConfig: function (newConfig) {
                    config = newConfig;
                    update();
                },
                getVisualization: getVisualization
            };
            _.extend(dashboard, Backbone.Events);
            return dashboard;
        }
    };
});
//TODO split this file up, it is too big
