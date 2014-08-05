FAMOUS_PATH = '../../../../../.famous';

Meteor.startup(function () {
	fs = Npm.require('fs');
	path = Npm.require("path");
	esprima = Npm.require('esprima');  //https://github.com/ariya/esprima
	escodegen = Npm.require('escodegen');  //https://github.com/Constellation/escodegen
	estraverse = Npm.require('estraverse'); //https://github.com/Constellation/estraverse
	highlighter = Npm.require('highlight.js');
	debug = Npm.require('debug')('test');
	init_data();
	
});


init_data = function() {
	//clear the db
	Classes.remove({});
	Code.remove({});

	var all_js_files = get_all_js_files(FAMOUS_PATH);
	all_js_files.forEach(function(file_path) {
		fs.readFile(file_path, 'utf8', Meteor.bindEnvironment(
			function(err, data) {
				if(err){
					throw err;
				} else{
					extract_class(esprima.parse(data, {loc: true}), file_path);
				}
			},
			function(e){
				console.log("ERROR BINDING METEOR", e);
			})
		);
	});
}

extract_class = function (syntax_tree, local_path) {

	estraverse.traverse(syntax_tree, {
		enter: function (node, parent) {
			handle_constructor(node, local_path);
			handle_prototype(node, local_path);
		},
		leave: function (node, parent) {

		}
	});
}

handle_prototype = function (node, local_path) {
	if (node.type == 'AssignmentExpression' ){
		try {
			if (node.left.object.property.name == 'prototype'){
				// save node.property.name as the function name on prototype for search
				var fn_name = node.left.property.name;
				// var snippet = escodegen.generate(node);
				var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
				var line = node.loc.start.line;
				var github = prepare_github_link(local_path, line);
				var class_name = node.left.object.object.name;
				var id = addClass(class_name, fn_name, snippet, github, line);
		    }
		} catch (error) {
			//if its not a prototype, it ends up here.
		}
	     
	}
}

handle_constructor = function (node, local_path) {
	if (node.type == "FunctionDeclaration" && node.id.name[0] != '_' && node.id.name[0] == node.id.name[0].toUpperCase()) {
	    // var snippet = escodegen.generate(node);
	    var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
	    var fn_name = node.id.name;
	    var line = node.loc.start.line;
	    var github = prepare_github_link(local_path, line);
	    var class_name = node.id.name;
	    var id = addClass(class_name, fn_name, snippet, github, line);
	}
}

prepare_class_name = function (node) {
	// var regex = '(?:..\/)+.famous\/(\S+)\/(\S+).js';
}

prepare_github_link = function (local_path, line) {
	//parse out the unwanted parts of local path
	return 'https://github.com/Famous/famous/blob/master' + local_path.substring(22) + "#L" + line;
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
			return path.extname(file) == '.js' && dir.indexOf("dist") < 0;
		}).forEach(function (file) {
			all_js_files.push(path.join(dir, file));
		});
    });
	return all_js_files;
}