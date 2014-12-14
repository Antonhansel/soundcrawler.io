var Branch = require('./models/branch.js');

exports.saveBranch = function(branchToSave, callback){
    Branch.findOne({name : branchToSave.name}, function(err, branch){
    	if (!branch) branch = new Branch();
    	branch.name = branchToSave.name;
    	branch.commit = JSON.stringify(branchToSave.commit);
    	branch.lastUpdate = Date();
        if (err) {}
        branch.save(callback);
    });
}