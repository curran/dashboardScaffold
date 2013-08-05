/**
 * A module for dynamically loading CSS files.
 *
 * Use case: a JS module needs some CSS file to work,
 * but the module may or may not be loaded, depending on configuration.
 * In this case it's preferable to load the CSS only if the module
 * loads, rather than loading the CSS with a tag in the HTML file 
 * regardless of whether the module is loaded.
 * It also saves developers the hassle of manually synchronizing HTML 
 * with loaded modules, which can become a pain as the application scales.
 */
define([], function(){
  return function(url){
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
});
