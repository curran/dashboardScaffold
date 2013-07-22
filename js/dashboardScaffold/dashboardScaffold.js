define(['codeMirror', 'inlet', 'd3', './dashboardUtils'],
    function(CodeMirror, Inlet, d3, dashboardUtils){

  return {
    /**
     * Initializes the dashboard configurator system.
     * Arguments:
     *
     *  * `editorId` The id of the textArea DOM element that should become the configuration editor.
     *  * `dashboardId` The id of the div DOM element that the dashboard will be injected into.
     */
    init: function(editorId, dashboardId){
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
        dashboard.setConfig(config);

        codeMirror.on('change', function(){
          var json = codeMirror.getValue();
          try{
            dashboard.setConfig(JSON.parse(json));
          }
          catch(e){
            dashboard.setConfig(invalidJSONConfig);
          }
        });
      });
    }
  };
});
