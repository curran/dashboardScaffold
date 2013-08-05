(function(){
  var dashboardScaffoldDir = '../../js';
  require.config({
    packages: [
      {
        name: 'dashboardScaffold',
        location: dashboardScaffoldDir,
        // If using Bower, you may want to use:
        //location:'../bower_components/dashboardScaffold/js';
      }
    ],
    paths: {
      /**
       * Standalone modules that can are part of dashboardScaffold but 
       * can be used independently of it:
       */
      getterSetters: dashboardScaffoldDir+'/getterSetters',
      loadCSS: dashboardScaffoldDir+'/loadCSS',

      /**
       * Third party libs:
       */
      underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
      backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
      d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.1.6/d3.min',
      leaflet: 'http://cdn.leafletjs.com/leaflet-0.6/leaflet',
      leafletProviders: 'http://leaflet-extras.github.io/leaflet-providers/leaflet-providers',
      // Had to reverse codeMirror and codeMirrorJS
      // in order to get file loading order right
      codeMirrorJS: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.12.0/codemirror.min',
      codeMirror: '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/javascript',
      inlet: '../lib/inlet.min'
    },
    shim: {
      underscore: { exports: '_' },
      backbone:{
        deps: ['underscore'],
        exports: 'Backbone'
      },
      d3: { exports: 'd3' },
      leaflet: { exports: 'L' },
      leafletProviders:{
        deps: ['leaflet'],
        exports: 'L'
      },
      codeMirror: {
        deps: ['codeMirrorJS'],
        exports: 'CodeMirror'
      },
      codeMirrorJS: {
        exports: 'CodeMirror'
      },
      inlet: { exports: 'Inlet' }
    }
  });
})();
