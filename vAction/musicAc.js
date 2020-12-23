// 业务控制
// 当前界面中的一些操作
// js面向对象的语法
// 函数名：function(){}
var musicAc = {
	init: function(){
		console.log("当前播放音乐的启动函数 主函数入口");
		musicAc.creaPlayer();
		musicAc.rdmMisic();
		
		// musicAc.move();
		// 按钮
		var mutedbtn = mui("#div_muted")[0];//静音的div
		var playbtn = mui("#div_play")[0];
		var rdmbtn = mui("#div_rdm")[0];
		// 切歌
		rdmbtn.addEventListener("tap",function(){
			var img = $(this).find("img")[0];
			musicAc.rdmMisic(img);
		})
		// this静音
		mutedbtn.addEventListener("tap",function(){
			// console.log(musicM.music_player.muted);
			// console.log(this)
			// var a = mui(this).get("img");
			var img = $(this).find("img")[0];
			musicAc.muted(img);
		});
		// 播放、暂停
		playbtn.addEventListener("tap",function(){
			var img = $(this).find("img")[0];
			musicAc.play(img);
		});
		// 拖动
		// 获取进度圆
		var mouseBox = mui("#time_tiao")[0];
		var mouseCri = mui("#time_play")[0];
		mouseBox.addEventListener("click",function(ev){
			// 获取当前鼠标位置
			var len = ev.clientX-220;
			// 计算进度圆的百分比位置
			var per = len/240*100;
			// 当计算的百分比为负数时 赋值为0
			if(per<0){
				per=0;
			}
			// 将新的位置赋值给进度圆
			mouseCri.style.left=per+"%";
			// 将时间也按百分比改变
			musicM.music_player.currentTime=musicM.music_player.duration*per/100;
		});
		
	},
	// 创建歌曲
	creaPlayer: function(){
		// 创建音频播放器
		musicM.music_player = document.createElement("audio");
		
	},
	// 切歌（随即自动的播放音乐）
	rdmMisic: function(_this){
		// 一个能在几秒钟消失的提示框
		mui.toast("切歌中...",{type:'div'});
		// 调用接口地址 获取数据 ajax技术来对接后台程序
		// getJSON是ajax的一个函数getJSON(api地址，条件（参数），返回数据)
		// 要素：
		// 1、api地址（数据接口地址）
		// 2、条件，
		// 3、返回数据
		mui.getJSON(musicM.musichotapi,{},function(data){
			// 获取的数据如下
				// code: 1
				// data:
				// artistsname: "艾福杰尼"
				// name: "说散就散"
				// picurl: "http://p4.music.126.net/JCxBPpX43h8yv32jUs5CNw==/109951163083330826.jpg"
				// url: "http://music.163.com/song/media/outer/url?id=523251474"
			// 请求到数据
			// musicM.musicinfo.src=data.data.url;//加载音乐地址
			// musicM.music_player.play();//播放音乐
			
			musicM.musicinfo.title=data.data.name;
			musicM.musicinfo.singer=data.data.artistsname;
			musicM.musicinfo.picurl=data.data.picurl;
			musicM.musicinfo.musicurl=data.data.url;
			console.log(musicM.musicinfo.title);
			mui("#musicbg")[0].style.backgroundImage="url("+musicM.musicinfo.picurl+")";
			// 加载歌手歌曲
			mui("#name")[0].innerHTML=musicM.musicinfo.title;
			mui("#singer")[0].innerHTML=musicM.musicinfo.singer;
			
			//播放音乐
			// 第一次播放（刷新）
			if(_this==undefined){
				var playbtn = mui("#div_play")[0];
				var img = $(playbtn).find("img")[0];
				musicAc.play(img);
			}
			// 点击切换按钮
			else if(_this.src.indexOf("microsoft_groove_96px.png")){
				var rdmbtn = mui("#div_rdm")[0];
				var img = $(rdmbtn).find("img")[0];
				musicAc.play(img);
			}
			// 暂停播放
			else{
				var playbtn = mui("#div_play")[0];
				var img = $(playbtn).find("img")[0];
				musicAc.play(img);
			}
		}
		);
	},
	// 暂停和播放
	play: function(_this){
		if(musicM.music_player==null){
			mui.toast("没有音源",{type:"div"});
			return;//终止方法
		}
		musicM.music_player.src=musicM.musicinfo.musicurl;//加载音乐地址
		if(_this.src.indexOf("img/pause_button_96px.png")>=0){
			mui.toast("暂停播放",{type:'div'});
			musicM.music_player.pause()
			_this.src="img/circled_play_96px.png";//暂停播放
		}else if(_this.src.indexOf("img/circled_play_96px.png")>=0){
			mui.toast("播放音乐",{type:'div'});
			musicM.music_player.play();
			_this.src="img/pause_button_96px.png";//正在播放
		}else{
			mui.toast("切换音乐",{type:'div'});
			musicM.music_player.play();
		}
		// 让进度条动起来
		musicAc.move();
		musicAc.bindData();
	},
	// 判断音乐播放完毕
	bindData:function(){
		if(musicM.music_player==null){
			return;
		}
		// 音频时间监控(播放结束)
		musicM.music_player.ontimeupdate = function(){
			if(musicM.music_player.onended || musicM.music_player.error!=null){
				musicM.music_player.onended=false;
				musicAc.rdmMisic();
				return;
			}
		}
		
		musicM.music_player.onError = function(){
			
		}
	},
	// 静音
	muted: function(_this){
		if(musicM.music_player==null){
			mui.toast("没有音源",{type:"div"});
			return;//终止方法
		}
		
		if(_this.src.indexOf("audio_96px.png")>=0){
			musicM.music_player.muted = true;
			_this.src="img/mute_96px.png";
		}else if(_this.src.indexOf("mute_96px.png")>=0){
			musicM.music_player.muted = false;
			_this.src="img/audio_96px.png";
		}
	},
	// 进度条
	move:function(){
		// 获取进度圆
		var time_move = mui("#time_play")[0];
		// 获取进度圆的位置
		// var x = time_move.style.left;
		var id = setInterval(function(){
			// var x = musicM.music_player.currentTime/musicM.music_player.duration*100;
			if(musicM.music_player.currentTime==musicM.music_player.duration){
				// 歌曲放完下一首
				// console.log(musicM.music_player.currentTime);
				musicM.music_player.currentTime=0;
				var playbtn = mui("#div_play")[0];
				var img = $(playbtn).find("img")[0];
				musicAc.rdmMisic(img);
			}else{
				// console.log(time_move.style.left);
				// 计算歌曲播放百分比
				var perTime = musicM.music_player.currentTime/musicM.music_player.duration*100;
				time_move.style.left=perTime+"%";
			}
		},1);
	},
	// 绑定歌词
	bindLrc: function(){
		
	},
}