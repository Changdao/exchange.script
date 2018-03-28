"use strict";


let Exchange = function(options){
    if(!options||!options.driver)throw new Error('No driver');
    this.driver = options.driver;
    this.driver.init(options);
    return this;
};

Exchange.prototype.getMarkets  = function(){
    return this.driver.remoteGetMarkets();
};

Exchange.prototype.useMarket = function(marketName){
    var market=new Market(this,marketName);
    return market;
};

Exchange.prototype.getBalance = function(){
    var result = this.driver.getBalance();
    return result;
};


let Market = function(exchange,marketName){
    this.exchange = exchange;
    this.marketName = marketName;
    this.driver = exchange.driver;
    return this;
};

Market.prototype.getLast=function(){
    return this.driver.getLast(this.marketName);
};

Market.prototype.sell = function(price,amount){
    return this.driver.sell(this.marketName,price,amount);
};

Market.prototype.buy = function(price,amount){
    return this.driver.buy(this.marketName,price,amount);
};


module.exports.Exchange = Exchange;
module.exports.Market = Market;