define(['underscore'], function(_){
  return function(map, options){
    var functions = {};
    _.each(_.keys(map), function(property){
      var callback = map[property];
      functions[property] = function(value){
        if (!arguments.length) return options[property];
        options[property] = value;
        if(callback){ callback(); }
        return functions;
      };
    });
    return functions;
  };
});
