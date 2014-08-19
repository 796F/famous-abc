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
    var blockId = Session.get('blockId');
    var projectName = Session.get('projectName');
    if(blockId && projectName){
      var block = Code.findOne({_id : blockId});
      // var inProject = Code.find({projectName: block.projectName, tokenArray: {$in : block.tokenArray}}).fetch();
      var inFile = Code.find({projectName: projectName, sourceId: block.sourceId, tokenArray: {$in : block.tokenArray}}).fetch();
      inFile = inFile.map(function(code) {
        code.content = hljs.highlight('js', code.content).value;
        code = makeLinks(code);
        return code;
      });
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

makeLinks = function (code) {
  //given a code object, use its tokenArrays field to tag its content field.
  var tokenArr = code.tokenArray;
  var content = code.content;
  for(var i = 0; i < tokenArr.length; i++) {
    var token = tokenArr[i];
    var re = new RegExp("\\b" + token + "\\b", "g");
    content.replace(re, "<span class='link' data-link='" + token + "'>" + token + "</span>");
  }
  return code;
}
