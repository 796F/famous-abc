Events = new Meteor.Collection('events');

addEvent = function (sid, type, content){
  Meteor.call('addEvent', sid, type, content);
}

Meteor.methods({
  addEvent: function (sid, type, content) {
      Events.insert({
        session_id: sid,
        content: content,
        type: type,
        timestamp: new Date()
      });
      return;
  }
});
