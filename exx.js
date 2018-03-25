var crypto = require('crypto');
var https = require('https');

var driverInstance={};

driverInstance.getBalance=function(){
    var secretKey = this.secretKey;
    var accessKey = this.accessKey;
    return new Promise(function(resolve,reject){
        const hmac = crypto.createHmac('sha512',secretKey);
        var params = "accesskey="+accessKey+"&nonce="+(new Date()).getTime();
        hmac.update(params);
        var sign=hmac.digest('hex');

        var baseURL = "https://trade.exx.com/api/getBalance";
        var url = baseURL+'?'+params+'&signature='+sign;
        https.get(url,(r)=>{
            var str= '';
            r.on('data', (chunk) => {
                str+= chunk.toString('utf8');
            });
            r.on('end',()=>{
                var obj = JSON.parse(str);
                resolve(obj);
            })
        }).on('error', (e)=> {
            console.error(e);
            reject(e);
        });
    });
};


driverInstance.init = function(accessKey,secretKey){
    this.accessKey = accessKey;
    this.secretKey = secretKey;
};



driverInstance.buy=function(price,amount,market){
    return new Promise(function(resolve,reject){
        const hmac = crypto.createHmac('sha512',secretKey);
        var params = "accesskey="+accessKey+'&amount='+amount+'&currency='+market+"&nonce="+(new Date()).getTime()+'&price='+price+'&type=buy';

        var baseURL = "https://trade.exx.com/api/order";
        hmac.update(params);
        var sign=hmac.digest('hex');

        var url = baseURL+'?'+params+'&signature='+sign;
        https.get(url,(r)=>{
            var str= '';
            r.on('data', (chunk) => {
                str+= chunk.toString('utf8');
            });
            r.on('end',()=>{
                var obj = JSON.parse(str);
                if(obj.code!='100')console.log(obj);
                resolve(obj);
            })
        }).on('error', (e)=> {
            console.error(e);
            reject(e);
        });
    })

};


driverInstance.sell=function(price,amount,market){
    return new Promise(function(resolve,reject){
        const hmac = crypto.createHmac('sha512',secretKey);
        var params = "accesskey="+accessKey+'&amount='+amount+'&currency='+market+"&nonce="+(new Date()).getTime()+'&price='+price+'&type=sell';

        var baseURL = "https://trade.exx.com/api/order";
        hmac.update(params);
        var sign=hmac.digest('hex');

        var url = baseURL+'?'+params+'&signature='+sign;
        https.get(url,(r)=>{
            var str= '';
            r.on('data', (chunk) => {
                str+= chunk.toString('utf8');
            });
            r.on('end',()=>{
                var obj = JSON.parse(str);
                if(obj.code!='100')console.log(obj);
                resolve(obj);
            })
        }).on('error', (e)=> {
            console.error(e);
            reject(e);
        });
    });

};

driverInstance.status=function(market){
    return new Promise(function(resolve,reject){
        var requesturl = "https://api.exx.com/data/v1/ticker?currency="+market;
        https.get(requesturl,(r)=>{
            var str= '';
            r.on('data', (chunk) => {
                str+= chunk.toString('utf8');
            });
            r.on('end',()=>{
                var obj = JSON.parse(str);
                if(obj.code!='100')console.log(obj);
                //change obj to can common obj
                this.last = obj.ticker.last;
                console.log(market+'',obj.ticker);

                resolve(obj);
            })
        }).on('error', (e)=> {
            console.error(e);
            reject(e);
        });
    });
};


module.exports=driverInstance;