const Discord = require('discord.js');
const discordClient = new Discord.Client();
const MessageEmbed = Discord.MessageEmbed;

const { TOKEN } = require('./config.json');
const fs = require('fs');
const article = fs.readFileSync("README.md").toString();

const fortune = require('./fortune.json');
const imageSet = require('./imageset.json');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
const randomMessage = function(msgList){
    return msgList[getRandomInt(0, msgList.length)];
}
const callNickname = function (guild, author){
	const member = guild.member(author);
	return member ? member.displayName : author.username;
}

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', msg => {
	const {content, channel, guild, author} = msg;
	const currentChannel = channel.name;
	const prefix = '<@!932090166254907422>';
	const prefix2 = '향란';

	//테스트용
	// if(author.username === 'fact'){
	// 	console.log(content);
	// }

	if(author.bot){
		return;
	}

	const nickname = callNickname(guild, author);
	
	if(content.startsWith(prefix) || content.startsWith(prefix2)){

		let command = ''
		if(content.startsWith(prefix)){
			command = content.replace(prefix, '').replace(' ', '');
		}else if(content.startsWith(prefix2)){
			command = content.split(' ')[1] !== undefined ? content.split(' ')[1] : '';
		}
		
		if(command === 'hellothisisverification'){
			channel.send('fact#4858(353467095876501504)');
			return;
		}

		if(command === '도움말' || command === ''){
			channel.send("\`\`\`"+article+"\`\`\`");
			return;
		}

		if(command.includes('타로') || command === 't'){			
			const arcana = fortune['arcana'];
			const number = getRandomInt(0, 22);
			const heading = getRandomInt(0, 2) === 0 ? true : false;
			const once = arcana[number];

			const imageEmbed = new MessageEmbed()
			//.setColor('#0099ff')
			.setImage(imageSet.arcana[heading ? 'upward' : 'downward'][number])
			.setTitle('당신이 뽑은 카드는')
			.setAuthor(nickname, author.avatarURL(), author.avatarURL())
			.setDescription(`**${once.name}**. 방향은 **${heading ? '정위치' : '역위치'}**.`)
			.setTimestamp()
			.setFooter('향란', discordClient.users.cache.get('932090166254907422').avatarURL());

			const fortuneEmbed = new MessageEmbed()
			//.setColor('#0099ff')
			.setTitle(once.name)
			.setAuthor(nickname, author.avatarURL(), author.avatarURL())
			.addFields(
				{ name: '요약', value: once.summary},
				{ name: '정방향은', value: once.upward},
				{ name: '역방향은', value: once.downward},
				{ name: '\u200B', value: '\u200B'},
				{ name: '연애운', value: once.meanings[0]},
				{ name: '직업운', value: once.meanings[1]},
				{ name: '금전운', value: once.meanings[2]},
				{ name: '성격운', value: once.meanings[3]},
				{ name: '기타운', value: once.meanings[4]},
			)
			.setTimestamp()
			.setFooter('향란', discordClient.users.cache.get('932090166254907422').avatarURL());

			channel.send(`<@!${author.id}>`);
			msg.reply(imageEmbed);
			msg.reply(fortuneEmbed);
		}
		return;
	}
});

discordClient.on("error", () => { console.log("error"); });

discordClient.login(TOKEN);