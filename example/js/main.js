/*global define, document, window */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"
define(['d3', 'underscore', 'dashboardScaffold', 'dashboardScaffold/dashboard'], function (d3, _, dashboardScaffold, Dashboard) {
    "use strict";
    var editor = document.getElementById('editor');
    if (editor) {
        dashboardScaffold.init('editor', 'dashboard');
    } else {
        d3.json('dashboardConfig.json', function (config) {
            var dashboard = Dashboard.createDashboard('dashboard');
            console.log(config);
            dashboard.setConfig(config);

            window.addEventListener('resize', _.debounce(function () {
                dashboard.update();
            }, 100));
        });
    }
});
