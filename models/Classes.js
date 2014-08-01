Classes = new Meteor.Collection('classes');

Meteor.methods({
	addClass: function (cName, fName, snippet, file_path, line_num) {		
		var id = Random.id();
	    Classes.insert({
	    	_id: id,
	    	className: cName,
	    	functionName: fName,
	    	content: snippet,
	    	path: file_path,
	    	line: line_num
	    	//ideally turn above two into https://github.com/mizzao/meteor-sharejs/blob/master/package.js#L14
	    });
	    return id;
	}
});