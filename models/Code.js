Code = new Meteor.Collection('code');

addCode = function(cname, fname, snippet, github, line_num, length, fileId) {
	var id = Random.id();
	Meteor.call('addCode', id, cname, fname, snippet, github, line_num, length, fileId);
	return id;
}

Meteor.methods({
	addCode: function (id, cname, fname, snippet, github, line_num, length, fileId) {		
    Code.insert({
    	_id: id,
    	className: cname,
    	functionName: fname,
    	content: snippet,
    	votes: 0,
    	github: github,
    	line: line_num,
    	length: length,
        fileId: fileId
    });
	}
});
