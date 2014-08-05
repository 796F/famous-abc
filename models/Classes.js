Classes = new Meteor.Collection('classes');

addClass = function (cname, fname, snippet, github, line_num){
	var id = Random.id();
	Meteor.call('addClass', id, cname, fname, snippet, github, line_num);
	return id;
}

functionCount = function(fname) {
	return Meteor.call('functionCount', fname);
}

classCount = function(cname) {
	return Meteor.call('classCount', cname);
}

Meteor.methods({
	addClass: function (id, cname, fname, snippet, github, line_num) {		
	    Classes.insert({
	    	_id: id,
	    	className: cname,
	    	functionName: fname,
	    	content: snippet,
	    	github: github,
	    	line: line_num
	    	//ideally turn above two into https://github.com/mizzao/meteor-sharejs/blob/master/package.js#L14
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