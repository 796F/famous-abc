if (Meteor.isClient) {
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
    // findTopWords(query);
    // results = Meteor.call('findTopWords', query);
    // console.log(results);
    return [{'name' : 'Surface.pipe'}, {'name': 'View.on'}];
  }

  Template.search.query = function () {
    return Session.get('query');
  }
}
