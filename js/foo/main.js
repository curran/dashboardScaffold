define(['./baz'], function(baz){
  return {
    speak: function(){
      console.log("Hello from package 'foo'");
      baz.speak();
    }
  };
});
