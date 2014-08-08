if (Meteor.isClient) {
  Template.feedback.events({
    'change input': function (event, template) {
      var feedback = event.target.value;
      addEvent(Meteor.default_connection._lastSessionId, 'feedback', feedback);
      $(event.target.parentElement).html('<p style="float: right;">THX! you can find mike X and zach P upstairs, usually sofa area</p>');
    }
  });

  Template.search.events({
    'keyup input#search-box': function (event, template) {
      Session.set('query', event.target.value);
      addEvent(Meteor.default_connection._lastSessionId, 'query', event.target.value);
    },
    'click a.suggestion' : function (event, template) {
      Session.set('query', event.target.innerText);
    }
  });

  Template.search.suggestions = function() {
    var query = Session.get('query');
    // var suggestions = findSuggestion(query);
    //findTopWords(query);
    var classes = allClasses();
    console.log("classes " + classes);
    console.log("after suggestin return");
    return [{'name' : 'Surface'}, {'name': 'View'}];
  }

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
    var regex = new RegExp("^"+query, "i");
    var results = query && query.length > 0 ? Code.find({functionName: regex}, {sort: { length: -1 }}) : Code.find({}, {limit: 20});
    var classNameResults = query && query.length > 0 ? Code.find({className: regex}, {sort: {length: -1}}) : null;
    if(classNameResults != null){
      return classNameResults.fetch().concat(results.fetch());
    }else{
      return results.fetch();
    }
    
  }

  Template.search.query = function () {
    return Session.get('query');
  }

  Template.codeblock.code = function () {
    var blockId = Session.get('blockId');
    return Code.findOne({_id : blockId});
  };

  Template.codeblock.rendered = function() {
    //hljs is not loaded immediately, must wait a second.  
    //cannot include hljs to meteor offline either, epic fail.  
    //not gonna waste time fixing this problem, will come back later.  
    //ideal solution is building customized meteor package, 5hrs.  
  }


}
