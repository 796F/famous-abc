Classes = new Meteor.Collection('classes');

addClass = function (cname, fname, snippet, file_path, line_num){
	var id = Random.id();
	Meteor.call('addClass', id, cname, fname, snippet, file_path, line_num);
	return id;
}

Meteor.methods({
	addClass: function (id, cname, fname, snippet, file_path, line_num) {		
	    Classes.insert({
	    	_id: id,
	    	className: cname,
	    	functionName: fname,
	    	content: snippet,
	    	path: file_path,
	    	line: line_num
	    	//ideally turn above two into https://github.com/mizzao/meteor-sharejs/blob/master/package.js#L14
	    });
	}
});