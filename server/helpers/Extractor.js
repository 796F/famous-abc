Extractor = {
	nomnom : function (node, value) {	  
	  if (node == null) 
	  	return;
	  if (node.type == value) {
	    var snippet = escodegen.generate(node);
	    console.log(snippet);
	  
	  } else {
	    for (var childKey in node) {
	      
	      //this node is a leaf.  skip it!      
	      if(typeof(node) != 'object')
	        return;

	      nomnom(node[childKey], value);

	    }
	  }
	}
}