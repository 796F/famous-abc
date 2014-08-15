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
      // console.log('showing source', target);
    },
    'click button.plus_button' : function (event, template) {
      var block = $(event.target).parent().parent();
      Meteor.call('voteUp', block.attr('data-block-id'));
    },
    'click button.minus_button' : function (event, template) {
      var block = $(event.target).parent().parent();
      Meteor.call('voteDown', block.attr('data-block-id'));
    }
  });

  Template.codeblock.codeblocks = function () {
    //get a list of code blocks that have to deal with the search term
    var query = Session.get('query');
    var regex = new RegExp(query, "i");
    var results = query && query.length > 0 ? Code.find({content: regex}, {sort: { votes: -1 }}) : Code.find({}, {limit: 100});
    return results.fetch();
  };
}
