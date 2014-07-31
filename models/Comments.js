Comments = new Meteor.Collection('comments');


Meteor.methods({
	addComment: function(comment, snippet_id) {
		var id = Random.id();
		Comments.insert({
			_id: id,
			content: comment, 
			snippetId: snippet_id
		});
		return id;
	}
});