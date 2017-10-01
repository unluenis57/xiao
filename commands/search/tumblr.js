const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const { TUMBLR_KEY } = process.env;

module.exports = class TumblrCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'tumblr',
			aliases: ['tumblr-blog'],
			group: 'search',
			memberName: 'tumblr',
			description: 'Searches Tumblr for information on a blog.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'blog',
					prompt: 'What is the url of the blog you would like to get information on?',
					type: 'string',
					parse: blog => encodeURIComponent(blog)
				}
			]
		});
	}

	async run(msg, { blog }) {
		try {
			const { body } = await snekfetch
				.get(`https://api.tumblr.com/v2/blog/${blog}/info`)
				.query({ api_key: TUMBLR_KEY });
			const data = body.response.blog;
			const embed = new MessageEmbed()
				.setColor(0x395976)
				.setAuthor('Tumblr', 'https://i.imgur.com/ouD9TUY.png')
				.setThumbnail(`https://api.tumblr.com/v2/blog/${blog}/avatar/512`)
				.setURL(data.url)
				.setTitle(data.title)
				.addField('❯ Posts',
					data.total_posts, true)
				.addField('❯ A.M.A.?',
					data.ask ? 'Yes' : 'No', true);
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.say(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};