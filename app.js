/**
 * 自动回复机器人 --- 函数式写法 
 * 公众号自动回复API + 图灵机器人API 强力驱动
 * codelines 243
 * @parm TULING { Object }  图灵 --- 已封装过
 * @parm Url { String } 基于公众号API -- http://api.qingyunke.com/api.php?key=free&appid=0&msg=${info}
 * @parm Robot { func } 机器人调用方法
 * @parm Input { func } 用户输入
 * @parm chatEacher { func } 交互式方法 -- 尬聊
 * @parm getUserInfo { func } 搜集用户信息 -- 做出下步行为
 * @parm Init { func } 初始化命令集
 * @parm robot { Object } 机器人配置信息 --- 基本信息
*/
(async () => {
	// 机器人
	function Robot({robot,userInfo,msg},next) {
		// 基于公众号API -- 哪个平台的我也忘了 =.=
		const request = require('request');
		const str = msg;
		const _ =encodeURI(str);  // url不能出现中文 需要转义

		request({
		    method: 'GET',
		    uri: `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${_}`,
		    // alternatively pass an object containing additional options
		  },
		  function (error, response, body) {
		    if (error) {
		      return console.log(`${robot.name}: 检测网络异常 --- ${error} `);
		    }
		    console.log(`\n${robot.name}:`, JSON.parse(body).content);
		 })

        
        // 基于图灵机器人API  --- test 
        function tulinRobot() {
	        const TULING = require('tuling');
			const http = require('http')
			 
			// 图灵还有点问题 --- 只能凋一次   = . =  个人免费版 -- key: appKey
			const tuling = new TULING({key: '7d8d510d602a4568869c20322*****'});
			 
			(async() => {
			  const result = await tuling.send({
			    userid: 3,
			    info: '微博现在最火的内容是什么?',   
			    loc: '南京市'
			  });
			  console.log('微博现在最火的内容是什么?')
			  console.log(result);
			})();
        }

        return next.call(this,{robot, userInfo},Robot)
	}

	// 用户输入
	function Input(robot) {
		const inquirer = require('inquirer');

		// 初始化聊天界面
		function Init(robot,next) {
				const promptList = [{
				    type: 'confirm',
				    message: '简单自我介绍一下，我叫小Q,很高兴认识您,想和我聊聊嘛~   ',
				    name: 'isChat',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "YES", // 默认值
				},{
				    type: 'confirm',
				    message: '在这之前呢，我想了解一下你，方便嘛~   ',
				    name: 'knowSelf',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "YES", // 默认值
				    when: (answers) => { // 当上一步问题为true的时候才会提问当前问题
				        return answers.isChat
				    }

				}];

				// 监听结果
			    inquirer.prompt(promptList).then(answers => {
			       let answer_ = ''; 
				   if(answers.isChat) {
				      answer_ += `${robot.name}:  😊我也好想和你聊聊呢 hhh~ `
				      if(answers.knowSelf) {
				      	answer_ += `我先介绍一下自己哦~ , 我叫${robot.name},今年${robot.age}, 喜欢${robot.hobby},梦想着${robot.dream}🤔,好了，轮到你啦，开始提问了哦~`;
				      }
				   }else {
				   	  answer_ += `${robot.name}:  🙁为啥不想和我聊天呢，难道我不招人喜欢嘛 ~ 再见!`
				   }

				   console.log(answer_);
				   next.call(this,robot,chatEachOther); 
				})
		}

		// 尬聊 =. =  
		function chatEachOther({robot, userInfo},next) {
					const promptList = [{
				    type: 'input',
				    message: '输入你想说的话 ~ 🤔 ',
				    name: 'chatmsg',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "不想说话", // 默认值
				}];

				// 监听结果
			    inquirer.prompt(promptList).then(answers => {
			       try {
			           const msg = answers.chatmsg;
			           if(msg == 'exit') return console.log(`${robot.name}: 下次再聊哦~  😂 `);
				       next.call(this,{robot, userInfo ,msg});
			       }catch (err) {
			       	  return chatEachOther({robot, userInfo},next)
			       }
			      
				})
		}


		// 获取用户信息
		function getUserInfo(robot,next) {
					const promptList = [{
				    type: 'confirm',
				    message: '准备好了嘛~ 😋  ',
				    name: 'ready',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "YES", // 默认值
				},{
				    type: 'input',
				    message: '你叫什么名字呢~   ',
				    name: 'username',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "匿名用户", // 默认值
				    when: (answers) => { // 当上一步问题为true的时候才会提问当前问题
				        return answers.ready
				    }
				},{
				    type: 'list',
				    message: '你是男的还是女的呀 😂 （这个我真不知道）~   ',
				    name: 'sex',
				    choices: [
				        "男",
				        "女",
				        "人妖"
				    ],
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "男", // 默认值
				},{
				    type: 'input',
				    message: '多大了?   ',
				    name: 'userage',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "22", // 默认值
				},{
				    type: 'input',
				    message: 'hh 你体重多少斤呀 ~ ',
				    name: 'weight',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "120", // 默认值
				},{
				    type: 'input',
				    message: 'do you have a dream ? 那会是什么呢 😂~ ',
				    name: 'dream',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "没有理想", // 默认值
				},{
				    type: 'input',
				    message: '你平时都喜欢做什么呀 🤔~ ',
				    name: 'hobby',
				    prefix: robot.name + ':',
				    suffix: "我: ",
				    default: "不知道喜欢做啥", // 默认值
				}];

				// 监听结果
			    inquirer.prompt(promptList).then(answers => {
			      try{
				       let answer_ = ''; 
					   console.log(`${robot.name}: 好了，我大概知道啦，你等我会，我需要消化下 😂 ~ `)

					   if(!answers.ready) {
					   	  console.log('都不想给我认识下 d(･｀ω´･d*) Bye~~')
					   	  return
					   }

					   const age = parseInt(answers.userage);
					   const weight = parseInt(answers.weight);

					   if(age > Number(robot.age)) {
					   	  var ageps = 'hh, 🤣 你比我大'; 
					   }else if(age = Number(robot.age)){
					   	  var ageps = 'hh, 🤣 我们一样大';
					   }else if(age < Number(robot.age) && (robot.sex == '男')) {
					   	  var ageps = 'hh, 🤣 你比我小,叫我大哥';
					   }

					   if(weight > 120){
					   	  var weightps = 'hh, 有点胖哦 ~ ';
					   }else if(weight < 100){
					   	  var weightps = 'hh, 有点瘦哦 ~ ';
					   }

					   answer_ += `我知道了，你叫${answers.username},${ageps},${weightps},你梦想着${answers.dream},原来你平时喜欢${answers.hobby} 😂 ~`;

					   setTimeout(() => {
							console.log(`${robot.name}: ${answer_}`);
							console.log(`${robot.name}: 好了,有没有什么话想对我说的 🤔 `);

						    next.call(this,{robot, userInfo: answers,},Robot);
					   },3000) 
				}catch(err) {
					console.log(`${robot.name}: 检测到您回答异常，请仔细回答哦 ~  😷`);
					return getUserInfo(robot,next)
				}

			})
		}

		return Init(robot,getUserInfo);
	}

	// 机器人个人信息
	const robot = {
		name: '小Q', 
		sex: '男',
		age: '22', 
		hobby: '听音乐', 
		dream: '有一天呢能成为拯救地球的辣个ren~ ',
	}

	return Input(robot);

})()





