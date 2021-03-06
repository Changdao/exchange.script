var crypto = require('crypto');
var https = require('https');
var shttps = require('socks5-https-client');
var util = require('./lib/util');


var driverInstance={};

var logger={
    error:function(){
        console.error.apply(null,arguments);
    },
    debug:process.env.EXCHANGE_DEBUG!=='true'?function(){}:function(){
        console.log.apply(null,arguments);
    }
};



driverInstance.init = function(options){
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    if(options.proxy)
    {
        logger.debug(options.proxy);
        var proxy = util.parseProxy(options.proxy);
        this.socksHost = proxy.socksHost;
        this.socksPort = proxy.socksPort;
    }
};

driverInstance.remoteGetMarkets = function(){
    throw new Error('OKEx do not support list markets.');
};


driverInstance.getLast=function(market){
    if(this.socksHost)
    {
        logger.debug('INFO:Requesting last through socks5');

        var socksHost = this.socksHost;
        var socksPort = this.socksPort;
        return new Promise(function(resolve,reject){
            shttps.get({url:'https://www.okcoin.com/api/v1/ticker.do?symbol='+market,
                socksHost:socksHost,
                socksPort:socksPort
            },function(res,err){
                if(err)
                {
                    logger.error(err);
                }
                else
                {
                    res.setEncoding('utf8');
                    res.on('readable',function(){
                        logger.debug(res.read());
                    });
                    res.on('error',function(err){
                        logger.error(err);
                    });
                    res.on('data',function(data){
                        logger.debug(data);
                    })
                }

            })
        });
    }
    else
    {
        return new Promise(function(resolve,reject){
            var url = 'https://www.okex.com/api/v1/ticker.do?symbol='+market;
            https.get(url,(r)=>{
                var data = '';
                r.on('data',(chunk)=>{
                    data+=chunk;
                });
                r.on('end',()=>{
                    resolve(JSON.parse(data));
                });
            }).on('error',(e)=>{
                //console.error(e);
                logger.error(e);
                reject(e);
            })
        });
    }
};

driverInstance.getBalance=function(){
    var secretKey = this.secretKey;
    var apiKey = this.apiKey;

    if(this.socksHost) {
        var socksHost = this.socksHost;
        var socksPort = this.socksPort;
        return new Promise(function(resolve,reject){

            var params = 'api_key='+apiKey+'&secret_key='+secretKey;
            const md5 = crypto.createHash('md5');

            var sign = md5.update(params).digest('hex').toUpperCase();
            var data = {
                api_key :apiKey,
                sign:sign
            };
            //var postData = JSON.stringify(data);
            var postData = 'api_key='+apiKey+'&sign='+sign;
            logger.debug(postData);

            //var url = "https://www.okex.com/api/v1/userinfo.do";

            var request=shttps.request({
                socksHost:socksHost,
                socksPort:socksPort,
                hostname:'www.okcoin.com',
                port:443,
                path:'/api/v1/userinfo.do',
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length
                }
            },(r)=>{
                var str= '';
                r.on('data', (chunk) => {
                    str+= chunk.toString('utf8');
                });
                r.on('end',()=>{
                    logger.debug('DATA:',str);
                    var obj = JSON.parse(str);
                    resolve(obj);
                })
            }).on('error', (e)=> {
                console.error(e);
                reject(e);
            });

            request.write(postData);
            request.end();
            logger.debug('........');
        });

    }

    else
    {
        return new Promise(function(resolve,reject){

            var params = 'api_key='+apiKey+'&secret_key='+secretKey;

            const digest = crypto.createHash('md5');
            var sign = digest.update(params).digest('hex').toUpperCase();
            var data = {
                api_key :apiKey,
                sign:sign
            };
            //var postData = JSON.stringify(data);
            var postData = 'api_key='+apiKey+'&sign='+sign;

            //var url = "https://www.okex.com/api/v1/userinfo.do";

            var request=https.request({
                hostname:'www.okex.com',
                port:443,
                path:'/api/v1/userinfo.do',
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },(r)=>{
                var str= '';
                r.on('data', (chunk) => {
                    str+= chunk.toString('utf8');
                });
                r.on('end',()=>{
                    logger.debug('DATA:',str);
                    var obj = JSON.parse(str);
                    resolve(obj);
                })
            }).on('error', (e)=> {
                console.error(e);
                reject(e);
            });

            request.write(postData);
            request.end();
            logger.debug('........');
        });
    }


};



driverInstance.sell=function(market,price,amount){
    return driverInstance.trade(market,price,amount,'sell');
};

driverInstance.buy=function(market,price,amount){
    return driverInstance.trade(market,price,amount,'buy');
};

driverInstance.trade=function(market,price,amount,type){
    var secretKey = this.secretKey;
    var apiKey = this.apiKey;
    return new Promise(function(resolve,reject){
        var params = ['api_key='+apiKey,
                      'symbol='+market,
                      'type='+type,
                      'price='+price,
                      'amount='+amount
                      ];
        
        var p2 =params.sort().join('&')+'&secret_key='+secretKey;
        logger.debug('[debug]:',p2);

        const digest = crypto.createHash('md5');
        var sign = digest.update(p2).digest('hex').toUpperCase();
        
        //var postData = JSON.stringify(data);
        var postData = params.join('&')+'&sign='+sign;
        logger.debug('[DEBUG]:',postData);

        //var url = "https://www.okex.com/api/v1/userinfo.do";
        try
        {
            var request=https.request({
                hostname:'www.okex.com',
                port:443,
                path:'/api/v1/trade.do',
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            },(r)=>{
                var str= '';
                r.on('data', (chunk) => {
                    str+= chunk.toString('utf8');
                });
                r.on('end',()=>{
                    logger.debug('DATA:',str);
                    var obj = JSON.parse(str);
                    resolve(obj);
                });
                r.on('error',(err)=>{
                    console.error(err);
                    reject(e);
                })
            }).on('error', (e)=> {
                console.error(e);
                reject(e);
            });

            request.write(postData);
            request.end();
            logger.debug('[DEBUG]:request trade end.');
        }
        catch(e)
        {
            logger.error(e);
            reject(e);
        }
        
    });
};



module.exports = driverInstance;
