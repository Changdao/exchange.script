var crypto = require('crypto');
var https = require('https');
var shttps = require('socks5-https-client');
var util = require('./lib/util');


var driverInstance={};


driverInstance.init = function(options){
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
    if(options.proxy)
    {
        var proxy = util.parseProxy(options.proxy);
        this.socksHost = proxy.socksHost;
        this.socksPort = proxy.socksPort;
    }
};

driverInstance.remoteGetMarkets = function(){

    if(this.socksHost)
    {
        var socksHost = this.socksHost;
        var socksPort = this.socksPort;
        return new Promise(function(resolve,reject){
            shttps.get({hostname:'api.exx.com',
                        path:'/data/v1/markets',
                        socksHost:socksHost,
                        socksPort:socksPort
            },function(res,err){
                res.setEncoding('utf8');
                res.on('readable',function(){
                    console.log(res.read());
                });
            })
        });
    }
    else
    {
        return new Promise(function(resolve,reject){
            https.get('https://api.exx.com/data/v1/markets',(r)=>{
                r.on('data',(chunk)=>{
                    data+=chunk;
                });
                r.on('end',()=>{
                    resolve(JSON.parse(data));
                });
            }).on('error',(e)=>{
                //console.error(e);
                reject(e);
            })
        })
    }

};

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