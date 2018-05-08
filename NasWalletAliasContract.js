"use strict";
var NasWalletAliasContract = function () {
    LocalContractStorage.defineMapProperty(this, "aliases");
    LocalContractStorage.defineMapProperty(this, "wallets");
};
NasWalletAliasContract.prototype = {
    init: function() {
    },
    _validateAlias: function(alias) {
    	if(!alias || alias === "") {
    		throw new Error("No alias provided");
    	}
    	
    	if(alias.length > 64) {
    		throw new Error("Invalid alias length. max 64 characters");
    	}

    	if(!/^[a-zA-Z0-9_\-.]+$/.test(alias)) {
    		throw new Error("Invalid alias. allowed characters: A-Z, 0-9, _, -, .");
    	}
    	return true;
    },
    createAlias: function(alias) {
    	if(alias) {
    		alias = alias.trim();   	
    	}
    	
    	this._validateAlias(alias);
    	
    	var from = Blockchain.transaction.from;
    	
    	if(this.wallets.get(alias) && this.wallets.get(alias) !== from) {
    		throw new Error("Alias is already reserved");
    	}
    	
    	this.aliases.set(from, alias);
    	this.wallets.set(alias, from);
    	return true;
    },
	getAlias: function() {
    	var from = Blockchain.transaction.from;
    	return this.aliases.get(from);
    },
    getAddressForAlias: function(alias) {
    	if(alias) {
    		alias = alias.trim();   	
    	}
    	
    	this._validateAlias(alias);
    	
    	return this.wallets.get(alias);
    },
    deleteAlias: function() {
    	var from = Blockchain.transaction.from;
    	var alias = this.aliases.get(from);
    	
    	if(!alias)
    	{
    		return true;
    	}
    	
    	this.aliases.del(from);
    	this.wallets.del(alias);
    	return true;
    },
    updateAlias: function(alias) {
    	if(alias) {
    		alias = alias.trim();   	
    	}
    	
    	this._validateAlias(alias);
    	
    	this.deleteAlias();
    	this.createAlias(alias);
    	return true;
    }
};
module.exports = NasWalletAliasContract;
