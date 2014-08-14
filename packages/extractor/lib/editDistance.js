PriorityQueue = Npm.require('priorityqueuejs');

editDistance = function(query, possibleWord) {
    //return arr of objects {'name': possibleWord}
    //initialize distMatrix with all zeros
    distMatrix = [];
    for(var m = 0; m <= query.length; m++) {
    	tempArr = [];
    	for(var n = 0; n <= possibleWord.length; n++) {
    		tempArr[n] = 0;
    	}
    	distMatrix[m] = tempArr;
    }

    for(var i = 1; i <= query.length; i++) {
    	distMatrix[i][0] = i;
    }

    for(var i = 1; i <= possibleWord.length; i++) {
    	distMatrix[0][i] = i;
    }

    for(var j = 1; j <= possibleWord.length; j++) {
    	for(var i = 1; i <= query.length; i++) {
    		if(query.charAt(i) === possibleWord.charAt(j)) {
    			distMatrix[i][j] = distMatrix[i-1][j-1];
    		} else {
    			distMatrix[i][j] = Math.min(distMatrix[i-1][j] + 1, distMatrix[i][j-1] + 1, distMatrix[i-1][j-1] + 1);
    		}
    	}
    }
    return distMatrix[query.length][possibleWord.length];
}

Meteor.methods({
    findTopWords : function(query) {
        console.log(query);
        var queue = new PriorityQueue(function(a, b) {
          return b.distance - a.distance;
        });

        possibleClasses = Classes.find({}, {className: 1, functionName: 1}).fetch();
        possibleClasses.forEach(function (match_element) {
            var distance = editDistance(query, match_element.className);
            queue.enq({distance: distance, value: match_element.className});
            distance = editDistance(query, match_element.functionName);
            queue.enq({distance: distance, value: match_element.functionName});
        });
        results = [];
        for(var i=0; i<5; i++) {
            //pop off five suggestions
            results.push(queue.deq());
        }
        console.log(results);
        return results;
    }
});
