if (Meteor.isClient) {

  Template.search.events({
    'change input#search-box': function (event, template) {
      console.log('pressed enter');
    },
    'keyup input#search-box': function (event, template) {
      Session.set('query', event.target.value);
    }
  });

  Template.results.events({
    'click' : function (event, template) {
      // $('code').html('');
      if(event.target.id){
        console.log("ID", event.target.id);
        Session.set('blockId', event.target.id);
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
