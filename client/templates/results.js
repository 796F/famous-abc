if (Meteor.isClient) {
  Template.results.events({
    'click' : function (event, template) {
      var oldId = Session.get('blockId');
      if(event.target.id && oldId != event.target.id){
        // console.log("ID", event.target.id);
        Session.set('blockId', event.target.id);
        addEvent(Meteor.default_connection._lastSessionId, 'result_click', event.target.id); 
      }
    }
  });

  Template.results.results = function () {
    var query = Session.get('query');
    var regex = new RegExp("^" + query, "i");
    var results = query && query.length > 0 ? Classes.find({key: regex}, {sort: { length: -1 }}) : Classes.find({}, {limit: 20});
    // var classNameResults = query && query.length > 0 ? Code.find({className: regex}, {sort: {length: -1}}) : null;
    // if(classNameResults != null){
    //   return classNameResults.fetch();
    // }else{
      return results.fetch();
    // }
    
  }
}
