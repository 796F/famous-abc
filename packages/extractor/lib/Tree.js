Node = require("./Node");

function Tree() {
	this.root = new Node();
	this.nodes = [];
	this.nodes.push(this.currentNode);
}

Tree.prototype.getRootNode = function() {
	return this.root;
}

//iterate this.nodes and look for connections
findConnections = function(newChild) {
	//connect existing nodes to this new child
	for(var i = 0; i < this.nodes.length; i++) {
		var currNode = this.nodes[i];
		var currNodesConnections = currNode.getConnections();
		for(var j = 0; j < this.currNodesChildren.length; j++) {
			if (currNodesConnections[j] === newChild.getFunctionName()) { //new current node is parent of new node
				currNode.addChild(newChild);

			};
		}
	}

	//connect this new child to existing nodes
}

Tree.prototype.addNode = function(functionName) {
	var newChild = Node(functionName);
	parent.addChild(newChild);
	findConnections(newChild);
	this.nodes.push(newChild);
}

module.exports = Tree;