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

Exchange.prototype.useMarket = function(market){

};

Exchange.prototype.getBalance = function(){
    var result = this.driver.getBalance();
    return result;
};


let Market = function(exchange,marketname){
    this.exchange = exchange;
};

Market.prototype.getLast=function(){

};

Market.prototype.sell = function(price,amount){

};

Market.prototype.buy = function(price,amount){

};


module.exports.Exchange = Exchange;
module.exports.Market = Market;