
Meteor.startup(function () {
	
  // init_tree();
  init_data();
  
});

init_tree = function () {
    Scoper.build_scope_tree();
}


init_data = function() {
  //clear the db
 	Classes.remove({});
  Code.remove({}); 
  Events.remove({});

  Sourcer.run();

  // Extractor.extract_source();
  // Extractor.extract_examples();


}
