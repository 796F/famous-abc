Meteor.startup(function () {
	
	init_data();

});

init_data = function() {
	var fs = Npm.require('fs');
	var path = Npm.require("path");
	var esprima = Npm.require('esprima');  //https://github.com/ariya/esprima
	var escodegen = Npm.require('escodegen');  //https://github.com/Constellation/escodegen
	var estraverse = Npm.require('estraverse');


	// get_all_files('/Users/michaelxia/Mike/famous', function (files) {
	// 	console.log(files);
	// });
	
	var kitten_code = esprima.parse('var kitten = new Cat();');
	var baby_code = esprima.parse('var baby = new Human();');

	estraverse.traverse(kitten_code, {
		enter: function (node, parent) {
			if (node.type == "NewExpression") {
              console.log(escodegen.generate(node));
            }
		},
		leave: function (node, parent) {

		}
	});

}

//given the root path of famous github repo, extract all files that we need to scan.  
get_all_files = function(root_path, callback) {
	fs.readdir(root_path, function (err, files) {
	    if (err) {
	        throw err;
	    }
	    //get all directories at the root
	    var directories = files.map(function (file) {
	    	return path.join(root_path, file);
	    }).filter(function (file) {
    		return fs.statSync(file).isDirectory();
	    });
	    var test = []
	    //for each directory scan for class defs
	    directories.forEach(function (dir) {
	    	var files = fs.readdir(dir);
	    	files.filter(function (file) {
    			return path.extname(file) == '.js';
    		}).forEach(function (file) {
    			test.push(root_path + dir + "/" +file);
    		});
	    });
	});
}