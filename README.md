# exchange.script

It's a common language for Cryptcurrency Markets.

# prototyp design

We try to build a library to easy do automatic trading. The library could be used like:

	const okexdriver = require('exchange.okex');
	const Exchange = require('exchange.script');
	let okex = new Exchange();
	let markets = okex.get_markets();
	let can_btc = markets['can/btc'];
	let price = can_btc.getLast().price;
	let volume = can_btc.getLast().volume;
	can_btc.sell();
	can_btc.buy();
	....

	