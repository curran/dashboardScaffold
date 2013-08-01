define(['dashboardScaffold', 'dashboardScaffold/dashboard'],
    function(dashboardScaffold, Dashboard){
  var editor = document.getElementById('editor');
  if(editor){
    dashboardScaffold.init('editor', 'dashboard');
  }
  else{
    d3.json('dashboardConfig.json', function(config){
      var dashboard = Dashboard.createDashboard('dashboard');
      console.log(config);
      dashboard.setConfig(config);

      window.addEventListener('resize', _.debounce(function(){
        dashboard.update();
      }, 100));
    });
  }
});
