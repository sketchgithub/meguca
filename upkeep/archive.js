var config = require('../config'),
    db = require('../db');

// Load hooks
require('../server/pix');
require('../server/games');

var yaku;
function connect() {
	var r;
	if (!yaku) {
		yaku = new db.Yakusoku('archive', db.UPKEEP_IDENT);
		r = yaku.connect();
		r.on('error', function (err) {
			console.error(err);
			process.exit(1);
		});
	}
	else
		r = yaku.connect();
	return r;
}

function at_next_minute(func) {
	var now = new Date().getTime();
	var inFive = new Date(now + 5000);

	var nextMinute = inFive.getTime();
	var ms = inFive.getMilliseconds(), s = inFive.getSeconds();
	if (ms > 0) {
		nextMinute += 1000 - ms;
		s++;
	}
	if (s > 0 && s < 60)
		nextMinute += (60 - s) * 1000;
	var delay = nextMinute - now;

	return setTimeout(func, delay);
}

var CLEANING_LIMIT = 10; // per minute

function clean_up() {
	var r = connect();
	var expiryKey = db.expiry_queue_key();
	var now = Math.floor(new Date().getTime() / 1000);
	r.zrangebyscore(expiryKey, 1, now, 'limit', 0, CLEANING_LIMIT,
				function (err, expired) {
		if (err) {
			console.error(err);
			return;
		}
		expired.forEach(function (entry) {
			var m = entry.match(/^(\d+):/);
			if (!m)
				return;
			var op = parseInt(m[1], 10);
			if (!op)
				return;
			yaku.archive_thread(op, function (err) {
				if (err)
					return console.error(err);
				r.zrem(expiryKey, entry, function (err, n) {
					if (err)
						return console.error(err)
					console.log("Archived thread #" + op);
					if (n != 1)
						console.warn("Not archived?");
				});
			});
		});
	});
	at_next_minute(clean_up);
}

if (require.main === module) {
	connect();
	at_next_minute(clean_up);
}