Scoper = {
  scopeChain : [],
  variableMap : {}, //variables mapped to what is assigned
  usedVariableMap : {}, //variables used mapped to the block using the var
  build_scope_tree: function () {
    var data = fs.readFileSync(EXAMPLES_PATH + "/Airbnb/src/app/MenuItemView.js", 'utf8');
    var ast = esprima.parse(data);
    estraverse.traverse(ast, {
      enter: function (node, parent) {
        if(createsNewScope(node) && !isModuleLoaderFunction(node)) {
          var identifiers = getIdentifiers(node);
          console.log(identifiers);
          // console.log(escodegen.generate(node));
          this.skip();
        }
        
        // if (node.type === 'CallExpression'){
        //   var currentScope = Scoper.scopeChain[Scoper.scopeChain.length - 1];
        //   // console.log(escodegen.generate(node.callee));
          
        // }

        // if (node.type === 'AssignmentExpression'){
        //   var key = escodegen.generate(node.left);
        //   Scoper.variableMap[key] = escodegen.generate(node);
        // }

        // if (node.type === 'Identifier') {
        //   var key = escodegen.generate(node);
        //   // Scoper.usedVariableMap[key] = escodegen.generate(node);
        //   console.log(parent);
        // }

      },
      leave: function (node, parent) {
        if (createsNewScope(node)){
          var currentScope = Scoper.scopeChain.pop();

          
        }
      }
    });
  }
}

getIdentifiers = function (node) {
  identifiers = [];
  estraverse.traverse(node, {
    enter: function (node, parent) {
      if (node.type === 'Identifier'){
        identifiers.push(node.name);
      }
    }
  });
  return identifiers;
}

createsNewScope = function (node) {
  return node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression';
}

isModuleLoaderFunction = function (node) {
  try{
    return node.params[0].name === 'require' && node.params[1].name === 'exports' && node.params[2].name === 'module';  
  }catch(error){
    //does not have these properties, thus not module loader
    return false;
  }
  
}
