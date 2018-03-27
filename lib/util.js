function parseProxy(proxy){
    var params = proxy.split(':');
    return {
        protocol:params[0],
        socksHost:params[1].slice(2),
        socksPort:params[2]
    };
};

module.exports.parseProxy = parseProxy;

