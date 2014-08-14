FAMOUS_PATH = '../client/app/famous';
EXAMPLES_PATH = '../client/app/examples';

PriorityQueue = Npm.require('priorityqueuejs');
path = Npm.require('path');
fs = Npm.require('fs');
esprima = Npm.require('esprima'); 
estraverse = Npm.require('estraverse'); 
highlighter = Npm.require('highlight.js');
escodegen = Npm.require('escodegen');

Extractor = {
  extract_source: function() {
    // //this was used to debug local paths on meteor's servers.
    // var filePath = process.cwd();
    // console.log('process.cwd', filePath);
    // console.log('fs', fs.readdirSync(filePath));
    // console.log('../', fs.readdirSync('../'));
    // console.log('../client', fs.readdirSync('../client'));
    // console.log('../client/app', fs.readdirSync('../client/app'));
    // console.log(fs.readFileSync('../client/app/famous/README.md', 'utf8'));

    all_js_files(FAMOUS_PATH).forEach(function(file_path) {
      var data = fs.readFileSync(file_path, 'utf8');
      var ast = esprima.parse(data, {loc: true});
      extract_class(ast, file_path);
    });
  },
  extract_examples: function() {
    var allJsFiles = getAllJsExampleFiles(EXAMPLES_PATH);
    allJsFiles.forEach(function(filePath) {
      fs.readFile(filePath, 'utf8', Meteor.bindEnvironment(function(err, data) {
          if(err){
            throw err;
          } else{
            handleFileData(filePath, data);
          }
        },
        function (error) {
          console.log(error);
        })
      );
    });
  }
}


extract_class = function (syntax_tree, local_path) {
  estraverse.traverse(syntax_tree, {
    //to run as you enter a node
    enter: function (node, parent) {
      // console.log("\nENTERING ",escodegen.generate(node));
      handle_constructor(node, local_path);
      handle_prototype(node, local_path);
      handle_default_option(node, local_path);
    },
    leave: function (node, parent) {
      // console.log("\nLEAVING");
    }
  });
}

handle_default_option = function (node, local_path) {
  if (node.type == 'AssignmentExpression'){

    try{
      if (node.left.property.name == 'DEFAULT_OPTIONS'){
        var class_name = node.left.object.name;
        var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
        var line = node.loc.start.line;
        var github = prepare_source_github_link(local_path, line);
        var fn_name = 'DEFAULT_OPTIONS';
        var id = addClass(class_name, fn_name, snippet, github, line);
      }
    } catch (error) {
      //not default options goes here
    }
  }
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
        var github = prepare_source_github_link(local_path, line);
        var class_name = node.left.object.object.name;
        var id = addClass(class_name, fn_name, snippet, github, line);
        }
    } catch (error) {
      //if its not a prototype, it ends up here.
    }
  }
}

handle_constructor = function (node, local_path) {
  //if its a function declaration that starts with uppercase and not a private function, its a constructor.  
  if (node.type == "FunctionDeclaration" && node.id.name[0] != '_' && node.id.name[0] == node.id.name[0].toUpperCase()) {
      // var snippet = escodegen.generate(node);
      var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
      var fn_name = node.id.name;
      var line = node.loc.start.line;
      var github = prepare_source_github_link(local_path, line);
      var class_name = node.id.name;
      var id = addClass(class_name, fn_name, snippet, github, line);
  }
}

prepare_source_github_link = function (local_path, line) {
  //given a path in my local github and a linenumber, generate a url which points to the github file/line.
  return 'https://github.com/Famous/famous/blob/master' + local_path.substring(20) + "#L" + line;
}

//given the root path of famous github repo, extract all files that we need to scan.  
all_js_files = function(root_path) {
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
        //only look at .js files that aren't made for distribution.
        return path.extname(file) == '.js' && dir.indexOf("dist") < 0;
      }).forEach(function (file) {
        all_js_files.push(path.join(dir, file));
      });
    });
  return all_js_files;
}

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


prepare_example_github_link = function (local_path, line) {
  return 'https://github.com/xiamike/famous-abc/tree/master/public/examples' + local_path.substring(22) + "#L" + line;
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
            //declaration
            var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
            var length = snippet.split("\n").length;
            // if(length < 3) return;
            var lineNum = node.loc.start.line;
            var github = prepare_example_github_link(filePath, lineNum);
            addCode(cname, fname, snippet, github, lineNum, length);
          }
        } catch (error) {
          console.log(error);
        }
      } else if(node.type === 'CallExpression') {
        try {         
          var cname = "";
          var fname = node.callee.property.name;
          if(functionCount(cname, fname) > 0) {
            //function
            var snippet = highlighter.highlight('js', escodegen.generate(node)).value;
            var length = snippet.split("\n").length;
            // if(length < 3) return;
            var lineNum = node.loc.start.line;
            var github = prepare_example_github_link(filePath, lineNum);
            addCode(cname, fname, snippet, github, lineNum, length);
          }
        
        } catch (error) {

        }
      }
    }
  });
}
