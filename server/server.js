
Meteor.startup(function () {
	
	init_data();

});



init_data = function() {
  //clear the db
 	Classes.remove({});
  Code.remove({}); 
  Events.remove({});

  Extractor.extract_source();
  Extractor.extract_examples();


}
