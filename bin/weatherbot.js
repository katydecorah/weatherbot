#!/usr/bin/env node

var weatherbot = require('../index.js');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.message || !argv.channel) {
    console.log('Usage:   weatherbot --message=<lorem ipsum> --channel=<channel>');
    console.log('Example: weatherbot --message=hello --channel=@katydecorah');
    process.exit(1);
}

weatherbot.post(argv.channel, argv.message, function(err, update) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Slack: posted to %s', argv.channel);
});