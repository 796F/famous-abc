Tree = require("./Tree");
Node = require("./Node");

tree = new Tree();
root = tree.getRootNode();
console.log(root);
root.addVariable('varName', 'class', 12);
root.addVariable('anotherVar', 'anotherClass', 23);
console.log(root);
var vars = root.getVariables();
for(var i = 0; i < vars.length; i++) {
	console.log(vars[i]);
}