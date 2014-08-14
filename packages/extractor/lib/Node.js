function Node(functionName) {
	this.functionName = functionName;
	//array of strings of nodes that the current node points to
	this.connections = [];
	this.children = [];
	this.variables = {};
}

Node.prototype.addConnection = function(connectionName) {
	this.connections.push(connectionName);
}

Node.prototype.getConnections = function() {
	return this.connections;
}

Node.prototype.getFunctionName = function() {
	return this.functionName;
}

Node.prototype.addChild = function(child) {
	this.children.push(child);
}

Node.prototype.getChildren = function() {
	return this.children;
}

Node.prototype.getNumChildren = function() {
	return this.children.length;
}

Node.prototype.addVariable = function(variableName, className, lineNumber) {
	var variable = {};
	variable['className'] = className;
	variable['lineNumber'] = lineNumber;
	this.variables[variableName] = variable;
}

Node.prototype.getVariables = function() {
	return this.variables;
}

module.exports = Node;