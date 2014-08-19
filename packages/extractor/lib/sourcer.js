FAMOUS_PATH = '../client/app/famous';

Sourcer = {
  run: function() {
    Sourcer.build_nodes();
    Sourcer.find_parents();
    Sourcer.consume_families();
  },
  root_nodes: [],
  orphan_nodes: [],
  build_nodes: function () {
    all_js_files = all_js_files(FAMOUS_PATH);
    all_js_files.forEach(function(file_path){
      var data = fs.readFileSync(file_path, 'utf8');
      var sourceId = addSourceFile(data, prepare_source_github_link(file_path, ""));
      var ast = esprima.parse(data, {loc: true});
      var node = extract_node(ast, file_path, sourceId);
      if (node.self == undefined){
        //utility files that aren't part of the api
      }else if(node.parent) {
        //child node
        Sourcer.orphan_nodes.push(node);
      }else{
        //parent nodes
        Sourcer.root_nodes.push(node);
      }
    });
  },
  find_parents: function () {
    while(Sourcer.orphan_nodes.length > 0) {
      var orphanIndex = Math.floor(Math.random() * Sourcer.orphan_nodes.length);
      var orphan = Sourcer.orphan_nodes[orphanIndex];
      searchAndAttach(orphan, Sourcer.root_nodes, orphanIndex);
    }
  },
  consume_families: function () {
    //prepare the families
    Sourcer.root_nodes.forEach(function (node){
      passDownFunctions(node.all_functions, node.children);
    });
    //consume the families
    Sourcer.root_nodes.forEach(function (node) {
      consumeFamily(node);
    });
  }
}

consumeFamily = function (node) {
  //for each node, consume all its children who have already been prepared.  
  node.children.forEach(function (node) {
    consumeFamily(node);
  });
  //once children are all gone, consume self functions.  
  node.all_functions.forEach(function (fn) {
    var length = fn.content.split("\n").length;
    var key = node.self + "." + fn.functionName; //Surface.on
    addClass(key, node.self, fn.functionName, fn.content, fn.github, fn.line, length, node.sourceId);
  });
}

passDownFunctions = function (fathers_functions, children) {
  children.forEach(function (node) {
    node.all_functions.push.apply(node.all_functions, fathers_functions);
    if (node.children.length > 0) {
      passDownFunctions(node.all_functions, node.children);
    }
  });
}

searchAndAttach = function (orphan, nodeList, orphanIndex) {
  for(var nodeIndex in nodeList){
    if (nodeList[nodeIndex].children.length > 0){
      //if children exist, recursively search for the orphan's parent in the children.
      searchAndAttach(orphan, nodeList[nodeIndex].children, orphanIndex);
    }
    if(orphan.parent == nodeList[nodeIndex].self){
      nodeList[nodeIndex].children.push(orphan);
      Sourcer.orphan_nodes.splice(orphanIndex, 1);
    }
  }
}

extract_node = function(syntax_tree, local_path, sourceId) {
  var result = {
    parent: false,
    all_functions: [],
    constructor: undefined,
    children: [],
    sourceId: sourceId,
  };
  estraverse.traverse(syntax_tree, {
    enter: function (node, parent) {
      if (isConstructor(node)) {
        result.constructor = {
          functionName: node.id.name,
          className: node.id.name,
          content: escodegen.generate(node),
          line: node.loc.start.line,
          github: prepare_source_github_link(local_path, node.loc.start.line),
        }
        result.self = node.id.name;
      }
      if (isInheritCode(node)) {
        saveInheritance(result, node);
      }
      if (isPrototype(node)){
        if(node.left.property.name != 'constructor') {
          result.all_functions.push({
          functionName: node.left.property.name,
          className: node.left.object.object.name || node.left.object.object.object.name,
          content: escodegen.generate(node),
          line: node.loc.start.line,
          github: prepare_source_github_link(local_path, node.loc.start.line)
        });
        result.self = node.left.object.object.name || node.left.object.object.object.name;  
        }
      }
      if (isDefaultOption(node)) {
        result.all_functions.push({
          functionName: 'DEFAULT_OPTIONS',
          className: node.left.object.name,
          content: escodegen.generate(node),
          line: node.loc.start.line,
          github: prepare_source_github_link(local_path, node.loc.start.line)

        });
      }
    },
    leave: function (node, parent) {

    }
  });
  return result;
}

isDefaultOption = function (node) {
  try {
    return node.type == 'AssignmentExpression' && node.left.property.name == 'DEFAULT_OPTIONS' && node.right.type == 'ObjectExpression';
  }catch (error) {
    return false;
  }
}

isConstructor = function (node) {
  return node.type == "FunctionDeclaration" && node.id.name[0] != '_' && node.id.name[0] == node.id.name[0].toUpperCase();
}

isInheritCode = function (node) {
  try {
    return node.type === 'AssignmentExpression' && node.left.property.name ==='prototype' && node.right.callee.property.name === 'create';
  } catch (err) {
    return false;
  }
}

isPrototype = function (node) {
  try {
    return node.type == 'AssignmentExpression' && node.left.object.property.name == 'prototype';
  }catch(error){
    return false;
  }
  
}

saveInheritance = function (result, node) {
  result.parent = node.right.arguments[0].object.name;
  result.self = node.left.object.name;
}

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
