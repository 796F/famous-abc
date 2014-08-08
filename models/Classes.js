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

allClasses = function() {
	return Meteor.call('allClasses');
}

allFunctions = function() {
	return Meteor.call('allFunctions');
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