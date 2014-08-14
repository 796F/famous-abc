if (Meteor.isClient) {
  Template.feedback.events({
    'change input': function (event, template) {
      var feedback = event.target.value;
      addEvent(Meteor.default_connection._lastSessionId, 'feedback', feedback);
      $(event.target.parentElement).html('<p style="float: right;">THX! you can find mike X and zach P upstairs, usually sofa area</p>');
    }
  });
}
