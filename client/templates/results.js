if (Meteor.isClient) {
  Template.results.events({
    'click' : function (event, template) {
      var oldId = Session.get('blockId');
      var blockId = $(event.target).attr('data-block-id');
      if(blockId && oldId != blockId){
        Session.set('blockId', blockId);
        clearHighlighting();
        $(event.target).css('-webkit-filter', 'invert(100%)');
        // addEvent(Meteor.default_connection._lastSessionId, 'result_click', projectName);
      }
    }
  });

  Template.results.results = function () {
    var query = Session.get('query');
    if(query && query.length > 0){
      var regex = new RegExp(query, "i");
      var results = Code.find({content: regex}, {projectName: 1}).fetch();
      return results;  
    }    
  }
}


clearHighlighting = function () {
  $('.result').each(function (target) {
    $(this).css('-webkit-filter', 'invert(0%)');
  });
}


// if (Meteor.isClient) {
//   Template.results.events({
//     'click' : function (event, template) {
//       var oldProject = Session.get('projectName');
//       var projectName = $(event.target).attr('data-project-name');
//       if(projectName && oldProject != projectName){
//         // console.log("projectName", projectName);
//         Session.set('projectName', projectName);
//         clearHighlighting();
//         $(event.target).css('-webkit-filter', 'invert(100%)');

//         addEvent(Meteor.default_connection._lastSessionId, 'result_click', projectName);
//       }
//     }
//   });

//   Template.results.results = function () {
//     var query = Session.get('query');
//     var regex = new RegExp(query, "i");
//     var results = query && query.length > 0 ? Code.find({content: regex}, {projectName: 1}).fetch() : Code.find({}, {projectName: 1, limit: 20}).fetch();
//     results = _.uniq(results, function (result) {
//       return result.projectName;
//     });
//     return results;
//   }
// }


// clearHighlighting = function () {
//   $('.result').each(function (target) {
//     $(this).css('-webkit-filter', 'invert(0%)');
//   });
// }
