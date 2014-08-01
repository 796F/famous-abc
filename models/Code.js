Code = new Meteor.Collection('code');

addCode = function(cname, fname, snippet, file_path, line_num) {
	var id = Random.id();
	Meteor.call('addCode', id, cname, fname, snippet, file_path, line_num);
	return id;
}

Meteor.methods({
	addCode: function (id, cname, fname, snippet, file_path, line_num) {		
	    Code.insert({
	    	_id: id,
	    	className: cname,
	    	functionName: fname,
	    	content: snippet,
	    	rating: 0,
	    	path: file_path,
	    	//ideally turn this into https://github.com/mizzao/meteor-sharejs/blob/master/package.js#L14
	    	line: line_num
	    });
	    return;
	}
});