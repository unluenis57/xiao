const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class CommandLeaderboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'command-leaderboard',
			aliases: ['cmd-lb', 'cmd-leaderboard', 'command-lb'],
			group: 'util-public',
			memberName: 'command-leaderboard',
			description: 'Responds with the bot\'s most used commands.',
			guarded: true,
			args: [
				{
					key: 'page',
					prompt: 'What page do you want to view?',
					type: 'integer',
					default: 1,
					min: 1
				}
			]
		});
	}

	run(msg, { page }) {
		const commands = this.filterCommands(this.client.registry.commands);
		const totalPages = Math.ceil(commands.size / 10);
		if (page > totalPages) return msg.say(`Page ${page} does not exist (yet).`);
		return msg.say(stripIndents`
			__**Command Usage Leaderboard (Page ${page}/${totalPages}):**__
			${this.makeLeaderboard(commands, page).join('\n')}
		`);
	}

	makeLeaderboard(commands, page) {
		let i = 0;
		let previousPts = null;
		let positionsMoved = 1;
		return commands
			.sort((a, b) => b.uses - a.uses)
			.map(command => {
				if (previousPts === command.uses) {
					positionsMoved++;
				} else {
					i += positionsMoved;
					positionsMoved = 1;
				}
				previousPts = command.uses;
				return `**${i}.** ${command.name} (${command.uses} Use${command.uses === 1 ? '' : 's'})`;
			})
			.slice((page - 1) * 10, page * 10);
	}

	filterCommands(commands) {
		return commands.filter(command => command.uses !== undefined && !command.unknown && !command.hidden);
	}
};
