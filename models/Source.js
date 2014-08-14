Source = new Meteor.Collection('source');

addSourceFile = function(content, github) {
  var id = Random.id();
  Meteor.call('addSourceFile', id, content, github);
  return id;
}

Meteor.methods({
  addSourceFile: function(id, content, github){
    Source.insert({
      _id: id,
      content: content,
      github: github
    });
  }
});
