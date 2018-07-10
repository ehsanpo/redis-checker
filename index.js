require("dotenv").config();
let Slack = require("slack-node");
let redis = require("redis");
let http = require("http");
let slack = new Slack();
slack.setWebhook(process.env.SLACK_URL);

let ready = "false";

let server = http.createServer(function(req, res) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	check_redis();
	res.end(ready);
});

server.listen(3000);

function check_redis() {
	let client = redis.createClient();
	client.on("error", function(err) {
		send_to_Slack(err);
	});
	client.on("ready", function(err) {
		ready = "true2";
		send_to_Slack(err);
	});
}

function send_to_Slack(msg) {
	
	slack.webhook(
		{
			channel: process.env.SLACK_CHANNEL,
			username: "Redis checker",
			icon_emoji: ":warning:",
			text: msg
		},
		function(err, response) {
			console.log("Slack:" + response.status);
			process.exit();
		}
	);
}
