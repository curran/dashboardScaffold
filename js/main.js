define(['codeMirror', 'inlet', 'd3', './dashboard'],
    function(CodeMirror, Inlet, d3, Dashboard){

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
      var codeMirror = CodeMirror.fromTextArea(editor);
      var dashboard = Dashboard.createDashboard(dashboardId);

      window.addEventListener('resize', _.debounce(function(){
        dashboard.update();
      }, 100));

      var invalidJSONConfig = {
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

      Inlet(codeMirror);
      codeMirror.setOption('mode', 'javascript');
      codeMirror.setSize('100%', '100%');
      d3.text('dashboardConfig.json', function(configJSON){
        // A flag to prevent redundantly resetting the
        // text every time the use changes it.
        var settingConfig = false;

        codeMirror.setOption('value', configJSON);
        dashboard.setConfig(JSON.parse(configJSON));

        codeMirror.on('change', function(){
          settingConfig = true;
          try{
            // This line will throw if parsing fails
            dashboard.setConfig(JSON.parse(codeMirror.getValue()));
          }
          catch(e){
            dashboard.setConfig(invalidJSONConfig);
          }
          settingConfig = false;
        });
        dashboard.on('configChanged', function(config){
          if(!settingConfig){
            codeMirror.setOption('value', JSON.stringify(config, null, 2));
          }
        });
      });
      return dashboard;
    }
  };
});
