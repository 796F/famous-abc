
Meteor.startup(function () {
	
  init_data();

});

init_data = function() {
  //clear the db
 	// Classes.remove({});
  Code.remove({}); 
  // Events.remove({});
  // Source.remove({});

  // Sourcer.run();

  Extractor.extract_examples();

}
