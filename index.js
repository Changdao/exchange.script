"use strict";

let Exchange = function(driver,options){
    if(!driver)throw new Error('No driver');
    this.driver = driver;

};

Exchange.prototype.getMarkets  = function(){
    return this.driver.remoteGetMarkets();
};

Exchange.prototype.useMarket = function(market){

};

let Market = function(){

};

Market.prototyp.getLast=function(){

};

Market.prototype.sell = function(price,amount){

};

Market.prototyp.buy = function(price,amount){

};

