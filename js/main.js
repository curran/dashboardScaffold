define(['d3', 'dashboardUtils'], function(d3, dashboardUtils){
  var dashboard = dashboardUtils.createDashboard();

  window.addEventListener('resize', _.debounce(function(){
    dashboard.update();
  }, 100));

  d3.json('dashboardConfig.json', function(config){
    dashboard.setConfig(config);
  });

  return { dashboard: dashboard };
});
