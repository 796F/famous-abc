Code = new Meteor.Collection('code');

addCode = function(cname, fname, snippet, github, line_num, length, projectName, sourceId) {
	var id = Random.id();
	Meteor.call('addCode', id, cname, fname, snippet, github, line_num, length, projectName, sourceId);
	return id;
}

addCodeSnippet = function (snippet, github, lineNum, projectName, sourceId, tokenArray) {
    var id = Random.id();
    Meteor.call('addCodeSnippet', id, snippet, github, lineNum, projectName, sourceId, tokenArray);
    return id;
}

Meteor.methods({
	addCode: function (id, cname, fname, snippet, github, line_num, length, projectName, sourceId) {		
    Code.insert({
    	_id: id,
    	className: cname,
    	functionName: fname,
    	content: snippet,
    	votes: 0,
    	github: github,
    	line: line_num,
    	length: length,
        projectName: projectName,
        sourceId: sourceId });
	},
    addCodeSnippet: function (id, snippet, github, lineNum, projectName, sourceId, tokenArray) {
        Code.insert({
            _id: id,
            content: snippet,
            github: github,
            line: lineNum,
            projectName: projectName,
            sourceId: sourceId,
            tokenArray: tokenArray
        });
    }
});
