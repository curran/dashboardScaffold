var require = {
  paths: {
    underscore: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
    backbone: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
    d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.1.6/d3.min',
    leaflet: 'http://cdn.leafletjs.com/leaflet-0.6/leaflet',
    // For debugging stack traces leaflet: '../libs/leaflet-src',
    leafletProviders: 'http://leaflet-extras.github.io/leaflet-providers/leaflet-providers',
    markerCluster: 'http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min'
  },
  shim: {
    underscore: { exports: '_' },
    backbone:{
      deps: ['underscore'],
      exports: 'Backbone'
    },
    d3: { exports: 'd3' },
    leaflet: { exports: 'L' },
    jquery: { exports: '$' },
    markerCluster:{
      deps: ['leaflet'],
      exports: 'L'
    },
    leafletProviders:{
      deps: ['leaflet'],
      exports: 'L'
    }
  }
};
