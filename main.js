/*global define, document, window */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"
define(['codeMirror', 'inlet', 'd3', 'underscore', './dashboard'], function (CodeMirror, inlet, d3, _, Dashboard) {

    "use strict";
    var visModulePath = "ingressMap/";

    function initEditor(config, dashboard, editor) {
        var codeMirror = CodeMirror.fromTextArea(editor),
            settingConfig = false,
            invalidJSONConfig = {
                "layout": {
                    "orientation": "vertical",
                    "children": [ { "name": "vis", "size": 1 } ]
                },
                "visualizations": {
                    "vis": {
                        "module": "vis",
                        "bkgColor": "red",
                        "lineColor": "red",
                        "labelText": "Invalid JSON",
                        "labelSize": "41pt"
                    }
                },
                "visDivCSS": {
                    "border-style": "solid",
                    "border-width": "2px"
                }
            };
        inlet(codeMirror);
        codeMirror.setOption('mode', 'javascript');
        codeMirror.setSize('100%', '100%');
        codeMirror.setOption('value', JSON.stringify(config, null, 2));
        codeMirror.on('change', function () {
            settingConfig = true;
            try {
                // This line will throw if parsing fails
                dashboard.setConfig(JSON.parse(codeMirror.getValue()));
            } catch (e) {
                dashboard.setConfig(invalidJSONConfig);
            }
            settingConfig = false;
        });
        dashboard.on('configChanged', function (config) {
            if (!settingConfig) {
                codeMirror.setOption('value', JSON.stringify(config, null, 2));
            }
        });
    }

    function init(config, dashboardId, editorId) {
        var dashboard = Dashboard.createDashboard(dashboardId, visModulePath),
            editor = document.getElementById(editorId);
        if (editor) { initEditor(config, dashboard, editor); }
        dashboard.setConfig(config);
        return dashboard;
    }

    return {
        /**
         * Initializes the dashboard configurator system.
         * Arguments:
         *
         *  * `config` The object parsed from the dashboard configuration JSON.
         *  * `editorId` The id of the textArea DOM element that should become the configuration editor.
         *  * `dashboardId` The id of the div DOM element that the dashboard will be injected into.
         */
        init: init
    };
});
