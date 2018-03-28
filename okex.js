var crypto = require('crypto');
var https = require('https');
var shttps = require('socks5-https-client');
var util = require('./lib/util');


var driverInstance={};


driverInstance.init = function(options){
    this.apiKey = options.apiKey;
    this.secretKey = options.secretKey;
    if(options.proxy)
    {
        console.log(options.proxy);
        var proxy = util.parseProxy(options.proxy);
        this.socksHost = proxy.socksHost;
        this.socksPort = proxy.socksPort;
    }
};

driverInstance.remoteGetMarkets = function(){

    if(this.socksHost)
    {
        console.log('INFO:Requesting markets through socks5');

        var socksHost = this.socksHost;
        var socksPort = this.socksPort;
        return new Promise(function(resolve,reject){
            shttps.get({hostname:'www.okcoin.com',
                path:'/api/v1/ticker.do',
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
            https.get('https://www.okex.com/api/v1/ticker.do',(r)=>{
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
            var postData = JSON.stringify(data);
            console.log(postData);

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
                    console.log('DATA:',str);
                    var obj = JSON.parse(str);
                    resolve(obj);
                })
            }).on('error', (e)=> {
                console.error(e);
                reject(e);
            });

            request.write(postData);
            request.end();
            console.log('........');
        });

    }

    else
    {
        return new Promise(function(resolve,reject){

            var params = 'api_key='+apiKey+'&secret_key='+secretKey;

            const digest = crypto.createHash('md5');
            var sign = digest.update(params).digest('hex');
            var data = {
                api_key :apiKey,
                sign:sign
            };
            var postData = JSON.stringify(data);

            //var url = "https://www.okex.com/api/v1/userinfo.do";

            var request=https.request({
                hostname:'www.okex.com',
                port:443,
                path:'/api/v1/userinfo.do',
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            },(r)=>{
                var str= '';
                r.on('data', (chunk) => {
                    str+= chunk.toString('utf8');
                });
                r.on('end',()=>{
                    console.log('DATA:',str);
                    var obj = JSON.parse(str);
                    resolve(obj);
                })
            }).on('error', (e)=> {
                console.error(e);
                reject(e);
            });

            request.write(postData);
            request.end();
            console.log('........');
        });
    }


};

driverInstance.getLast=function(market){
    if(this.socksHost)
    {
        console.log('INFO:Requesting last through socks5');

        var socksHost = this.socksHost;
        var socksPort = this.socksPort;
        return new Promise(function(resolve,reject){
            shttps.get({url:'https://www.okcoin.com/api/v1/ticker.do?symbol='+market,
                socksHost:socksHost,
                socksPort:socksPort
            },function(res,err){
                if(err)
                {
                    console.error(err);
                }
                else
                {
                    res.setEncoding('utf8');
                    res.on('readable',function(){
                        console.log(res.read());
                    });
                    res.on('error',function(err){
                        console.error(err);
                    });
                    res.on('data',function(data){
                        console.log(data);
                    })
                }

            })
        });
    }
    else
    {
        return new Promise(function(resolve,reject){
            https.get('https://www.okex.com/api/v1/ticker.do',(r)=>{
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
        });
    }
};


module.exports = driverInstance;