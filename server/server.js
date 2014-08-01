Meteor.startup(function () {
	fs = Npm.require('fs');
	path = Npm.require("path");
	esprima = Npm.require('esprima');  //https://github.com/ariya/esprima
	escodegen = Npm.require('escodegen');  //https://github.com/Constellation/escodegen
	estraverse = Npm.require('estraverse');
	
	init_data();

});

init_data = function() {
	var all_js_files = get_all_js_files('/Users/michaelxia/Mike/famous');
	all_js_files.forEach(function(file_path) {
		fs.readFile(file_path, 'utf8', function(err, data) {
			
			if(err)
				throw err;
			else
				extract_class(esprima.parse(data, {loc: true}));

		});
	});
}

extract_class = function (syntax_tree) {

	estraverse.traverse(syntax_tree, {
		enter: function (node, parent) {
			handle_fn_declaration(node);
			// handle_assign_expression(node);
		},
		leave: function (node, parent) {

		}
	});
}

handle_assign_expression = function (node) {
	if (node.type == 'AssignmentExpression' ){
		try {
			if (node.left.object.property.name == 'prototype'){
				// save node.property.name as the function name on prototype for search
				var fn_name = node.left.property.name;
				var snippet = escodegen.generate(node);
				var line = node.loc.start.line;
		     	
		     	// TODO: insert to database in querieable way
		     	console.log();
		    }
		} catch (error) {

		}
	     
	}
}

handle_fn_declaration = function (node) {
	if (node.type == "FunctionDeclaration") {
	    var snippet = escodegen.generate(node);
	    var fn_name = node.id.name;
	    var line = node.loc.start.line;
	    // save node.id.type.name as the function name for search
	    console.log(line);
	}
}

//given the root path of famous github repo, extract all files that we need to scan.  
get_all_js_files = function(root_path, callback) {
	//get all directories at the root
	var famous_dirs = fs.readdirSync(root_path).map(function (file) {
		return path.join(root_path, file);
	}).filter(function (file) {
		return fs.statSync(file).isDirectory();
	});
	var all_js_files = [];
	//for each directory scan for class defs
    famous_dirs.forEach(function (dir) {
    	var files = fs.readdirSync(dir);
    	files.filter(function (file) {
			return path.extname(file) == '.js' && file.indexOf(".min.js") < 0;
		}).forEach(function (file) {
			all_js_files.push(path.join(dir, file));
		});
    });
	return all_js_files;
}