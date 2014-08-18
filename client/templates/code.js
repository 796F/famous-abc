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
    // var query = Session.get('query');
    var blockId = Session.get('blockId');
    // var regex = new RegExp(query, "i");
    // var results = Code.find({_id: blockId });
    if(blockId){
      var block = Code.findOne({_id : blockId});
      // var inProject = Code.find({projectName: block.projectName, tokenArray: {$in : block.tokenArray}}).fetch();
      var inFile = Code.find({projectName: block.projectName, sourceId: block.sourceId, tokenArray: {$in : block.tokenArray}}).fetch();

      return inFile;  
    }
  };

  // Template.source.content = function () {
  //   try{
  //     var sourceId = Code.findOne({_id : this._id}).sourceId;
  //     return Source.findOne({_id: sourceId}).content;  
  //   } catch( error ){
  //     console.log( error);
  //     console.log(Code.findOne({_id : this._id}));
  //   }
  // }
}
