Events = new Meteor.Collection('events');

addEvent = function (type, content){
  var id = Random.id();
  Meteor.call('addEvent', id, type, content);
  return id;
}

Meteor.methods({
  addEvent: function (id, type, content) {
      Events.insert({
        _id: id,
        content: content,
        type: type,
        timestamp: new Date()
      });
      return;
  }
});
