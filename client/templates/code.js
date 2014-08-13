if (Meteor.isClient) {
  Template.codeblock.events({
      'click button.hiding_source' : function (event, template) {
        var currentBlockId = Session.get('blockId');
        //get the source block Id associated with this snippet
        var target = $(event.target);
        target.removeClass('hiding_source').addClass('showing_source');
        console.log('hiding source', target);
      },
      'click button.showing_source' : function (event, template) {
        var currentBlockId = Session.get('blockId');
        //get the source block Id associated with this snippet
        var target = $(event.target);
        target.removeClass('showing_source').addClass('hiding_source');
        console.log('showing source', target);
      },
      'click button.plus_button' : function (e, t) {
        var currentBlockId = Session.get('blockId');
        //get the source block Id associated with this snippet
        var target = $(event.target);
        console.log(target);
      },
      'click button.minus_button' : function (e, t) {
        var currentBlockId = Session.get('blockId');
        //get the source block Id associated with this snippet
        var target = $(event.target);
        console.log(target);
      }
    });

  Template.codeblock.code = function () {
      //get a list of code blocks that have to deal with the search term
      var blockId = Session.get('blockId');
      return Classes.findOne({_id : blockId});
    };
}
