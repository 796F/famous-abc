Classes = new Meteor.Collection('classes');

addClass = function (key, cname, fname, snippet, github, line_num, length){
	var id = Random.id();
	Meteor.call('addClass', id, key, cname, fname, snippet, github, line_num, length);
	return id;
}

functionCount = function(fname) {
	return Meteor.call('functionCount', fname);
}

classCount = function(cname) {
	return Meteor.call('classCount', cname);
}

Meteor.methods({
	addClass: function (id, key, cname, fname, snippet, github, line_num, length) {		
	    Classes.insert({
	    	_id: id,
	    	key: key,
	    	className: cname,
	    	functionName: fname,
	    	content: snippet,
	    	github: github,
	    	line: line_num,
	    	length: length
	    });
	    return;
	},
	classCount: function(cname) {
		return Classes.find({"className": cname}).count();
	},
	functionCount: function(fname) {
		return Classes.find({"functionName": fname}).count();
	}
});
