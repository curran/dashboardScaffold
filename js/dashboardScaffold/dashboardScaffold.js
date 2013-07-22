define(['codeMirror', 'inlet', 'd3', './dashboardUtils'],
    function(CodeMirror, Inlet, d3, dashboardUtils){

  return {
    /**
     * Initializes the dashboard configurator system.
     * Arguments:
     *
     *  * `editorId` The id of the textArea DOM element that should become the configuration editor.
     *  * `dashboardId` The id of the div DOM element that the dashboard will be injected into.
     *  * `configChangeCallback` a callback function that is called each time the config is updated. The new configuration object is passed to the callback.
     */
    init: function(editorId, dashboardId, configChangeCallback){

      // If no callback was given, use an empty function instead
      if(!configChangeCallback){
        configChangeCallback = function(){};
      }

      var editor = document.getElementById(editorId);

      var dashboard = dashboardUtils.createDashboard(dashboardId);

      // TODO move this to main
      window.addEventListener('resize', _.debounce(function(){
        dashboard.update();
      }, 100));

      var invalidJSONConfig = {
        "visualizations": {
          "vis": { 
            "color": "red",
            "text": "Invalid JSON",
            "fontSize": "30pt"
          }
        },
        "layout": {
          "orientation": "vertical",
          "children": [ { "name": "vis", "size": 1 } ]
        },
        "visDivCSS": { "border-style": "solid", "border-width": "2px" }
      };

      var codeMirror = CodeMirror.fromTextArea(editor);
      Inlet(codeMirror);
      codeMirror.setOption('mode', 'javascript');
      codeMirror.setSize('100%', '100%');
      d3.text('dashboardConfig.json', function(configJSON){
        var config = JSON.parse(configJSON);

        codeMirror.setOption('value', configJSON);

        configChangeCallback(config);
        dashboard.setConfig(config);

        codeMirror.on('change', function(){
          var json = codeMirror.getValue(), config;
          try{
            // This line will throw if parsing fails
            config = JSON.parse(json);

            configChangeCallback(config);
            dashboard.setConfig(config);
          }
          catch(e){
            dashboard.setConfig(invalidJSONConfig);
          }
        });
      });
    }
  };
});
