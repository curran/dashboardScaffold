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
 * To listen, use:
 *   `theFunction.on('change', function (newValue) { ... });`
 *
 * The getter-setter pattern with change events enables a
 * data flow pattern to be implemented. This means that
 * a property can be "piped" into another property or function.
 * This is implemented in `getterSetters.connect()`.
 */
define(['underscore', 'backbone'], function (_, Backbone) {
    "use strict";
    function getterSetters(options) {
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
    }

    getterSetters.connect = function (property, fn) {
        // Call the function once to initialize the value.
        fn(property());

        // Call the function when the property changes.
        // The new property value is passed as an argument to fn.
        property.on('change', fn);
    };

    return getterSetters;
});
