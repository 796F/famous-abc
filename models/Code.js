Code = new Meteor.Collection('code');

test = function() {
	var id = Meteor.call('addSnippet', "surface", "setcontent", "surface.setContent();", "meme.js", 14);
	console.log(id);
}

//access globally with Meteor.call('test');
Meteor.methods({
	addSnippet: function (cName, fName, snippet, file_path, line_num) {		
		var id = Random.id();
		debugger;
	    Code.insert({
	    	_id: id,
	    	className: cName,
	    	functionName: fName,
	    	content: snippet,
	    	rating: 0,
	    	path: file_path,
	    	//ideally turn this into https://github.com/mizzao/meteor-sharejs/blob/master/package.js#L14
	    	line: line_num 			
	    });
	    return id;
	}
});