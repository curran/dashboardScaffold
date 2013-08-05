/*global define */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"

/**
 * A generator for getter-setter-with-change-event functions.
 * Takes as input an options object, returns an object whose
 * properties are getter-setter functions corresponding to
 * properties of the options object.
 *
 * See http://bost.ocks.org/mike/chart/ for a description 
 * of the setter-getter function pattern.
 *
 * In addition to this pattern, the functions emit change events.
 * To listen, use `theFunction.on('change', function (newValue) { ... });`
 */
define(['underscore', 'backbone'], function (_, Backbone) {
    "use strict";
    return function (options) {
        var my = {};
        _.each(_.keys(options), function (property) {
            var fn = function (value) {
                if (!arguments.length) {
                    return options[property];
                }
                options[property] = value;
                fn.trigger('change', value);
                return my;
            };
            _.extend(fn, Backbone.Events);
            my[property] = fn;
        });
        return my;
    };
});
