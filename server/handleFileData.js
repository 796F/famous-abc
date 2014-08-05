EXAMPLES_PATH = '../../../../../.examples'

getProjectDirectories = function(root_path) {
	return fs.readdirSync(root_path).map(function (file) {
		return path.join(root_path, file);
	}).filter(function (file) {
		return fs.statSync(file).isDirectory();
	});
}

getSourceFile = function(projectPath) {
	var contents = fs.readdirSync(projectPath);
	var sourceFile = "";
	contents.forEach(function(dir) {
		if(dir === 'src') sourceFile = path.join(projectPath, dir);
	});
	return sourceFile;
}

getJsFilesRecursive = function(directory) {
	var jsFiles = [];
	var contents = fs.readdirSync(directory);
	contents.forEach(function(dir) {
		var dirPath = path.join(directory, dir);
		if(fs.statSync(dirPath).isDirectory()) {
			//recurse and add to jsFiles
			jsFiles.push.apply(jsFiles, getJsFilesRecursive(dirPath));
		} else if(fs.statSync(dirPath).isFile() && path.extname(dirPath) == '.js' && dirPath.indexOf("dist") < 0) {
			jsFiles.push(dirPath);
		}
	});
	return jsFiles;
}

getAllJsExampleFiles = function(root_path, callback) {
	//get all directories at the root
	var directories = getProjectDirectories(root_path);
	
	var sourceFiles = [];
	directories.forEach(function(dir) {
		var newSourceFile = getSourceFile(dir);
		sourceFiles.push(newSourceFile);
	});

	var jsFiles = [];
	sourceFiles.forEach(function(dir) {
		var newJsFiles = getJsFilesRecursive(dir);
		jsFiles.push.apply(jsFiles, newJsFiles);
	});

	return jsFiles;
}

handleFileData = function(filePath, data) {
	var ast = esprima.parse(data, {loc: true});
	estraverse.traverse(ast, {
		enter: function(node) {
			if (node.init && node.init.type === 'NewExpression') {
				try {
					var cname = node.init.callee.name;
					var fname = "";
					if(classCount(cname) > 0) {
						var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
						var lineNum = node.loc.start.line;
						var github = prepare_github_link(filePath, lineNum);
						addCode(cname, fname, snippet, github, lineNum);
					}
				} catch (error) {

				}
			} else if(node.type === 'CallExpression') {
				try {					
					var cname = "";
					var fname = node.callee.property.name;
					if(functionCount(fname) > 0) {
						var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
						var lineNum = node.loc.start.line;
						var github = prepare_github_link(filePath, lineNum);
						addCode(cname, fname, snippet, github, lineNum);
					}
				
				} catch (error) {

				}
			}
		}
	});
}

loadExamplesTable = function() {
	var estraverse = Npm.require('/usr/local/lib/node_modules/estraverse/');
	var fs = Npm.require('fs');
	var esprima = Npm.require('esprima');

	var allJsFiles = getAllJsExampleFiles(EXAMPLES_PATH);

	allJsFiles.forEach(function(filePath) {
		fs.readFile(filePath, 'utf8', Meteor.bindEnvironment(
			function(err, data) {
				if(err){
					throw err;
				} else{
					handleFileData(filePath, data);
				}
			},
			function(e){
				console.log("ERROR BINDING METEOR", e);
			})
		);
	});
}