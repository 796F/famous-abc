Classes = new Meteor.Collection('classes');

addClass = function (key, cname, fname, snippet, github, line_num, length, sourceId){
	var id = Random.id();
	Meteor.call('addClass', id, key, cname, fname, snippet, github, line_num, length, sourceId);
	return id;
}

functionCount = function(fname) {
	return Meteor.call('functionCount', fname);
}

classCount = function(cname) {
	return Meteor.call('classCount', cname);
}

allClasses = function() {
	return Meteor.call('allClasses');
}

allFunctions = function() {
	return Meteor.call('allFunctions');
}

Meteor.methods({
	addClass: function (id, key, cname, fname, snippet, github, line_num, length, sourceId) {		
	    Classes.insert({
	    	_id: id,
	    	key: key,
	    	className: cname,
	    	functionName: fname,
	    	content: snippet,
	    	github: github,
	    	line: line_num,
	    	length: length,
	    	sourceId: sourceId
	    });
	    return;
	},
	classCount: function(cname) {
		return Classes.find({"className": cname}).count();
	},
	functionCount: function(cname, fname) {
		if(cname === "") {
			return Classes.find({"functionName": fname}).count();
		} else {
			return Classes.find({"functionName": fname, "className":cname}).count();
		}
	},
	allClasses: function() {
		var temp = Classes.find({},{'className':1}).fetch();
		var result = [];
		for(var i = 0; i < temp.length; i++) {
			result[i] = temp[i].className;
		}
		return result;
	}, 
	allFunctions: function() {
		return Classes.distinct('functionName', {'functionName': {$ne: null}});
	}
});
