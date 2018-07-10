/*
 * @Author: Terence 
 * @Date: 2018-03-26 15:23:27 
 * @Last Modified by: Terence
 * @Last Modified time: 2018-07-10 16:47:54
 */

 /**
  * 
  * @param {DOM} container 保存最外层的DOM元素
  * @param {DOM} input 保存显示时间的input
  * @param {Boolean} isShowHour 是否显示时间
  * @param {Boolean} output 是否向input输出时间
  * @param {Function} callback 执行完毕的回调函数
  * 
  * {$_$DateTime, show, hide} 为外部可调用方法，其他禁止外部使用
  * 
  * @return $_$DateTime
  */

;(function() {
	var $_$DateTime = function (params) {
		return new DateTime(params);
	}
	
	function DateTime(params) {
		//在此处定义 全局变量
		this.wrap = params.container;       //保存最外层的DOM元素
		this.input = params.input;          //保存显示时间的input
		this.selectDay = '';        //2018-03-04
		this.selectHour = '';       //00:00:00
		this.iTime = 0;
		this.callback = params.callback;
		this.isShowHour = params.isShowHour;
		this.output = params.output;
		this.now = '';  //当前的时间
	
		//完成后删除
		// this.doc = document;
		// s={w:window.innerWidth,h:window.innerHeight};
		// var oHtml = this.doc.querySelector('html');
		// oHtml.style.fontSize = (s.h<900?900:s.h)/45 + 'px';
		//完成后删除
	
		this.init();
	
	}
	
	//初始化，只执行一次，在最外层绑定事件
	DateTime.prototype.init = function() {
		var This = this;
		// this.wrap.addEventListener("click", function(ev) {
		//     This.act.call(This, ev);
		// }, false);
	
		this.wrap.onclick = function(ev) {
			This.act.call(This, ev);
		}
	
		this.input.onfocus = function(ev) {
			This.show();
		}
	
		// this.wrap.style.outline = "none";
		// this.wrap.style.display = "block";
		// this.wrap.setAttribute('tabindex', '0');
		// this.wrap.onblur = function(ev) {
		// 	This.hide();
		// }
	
		
		var date = new Date();
		var year = date.getFullYear(); //获取当前年份(0-11,0代表1月)
		var month = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
		var day = date.getDate(); //获取当前日(1-31)
		this.selectDay = year + '-' + (month > 9 ? month : ('0' + month)) + '-' + day;
		this.render(year, month, day);
		return this;
	}
	
	/**
	 * 根据 param 渲染视图
	 * @param {number} year 
	 * @param {number} month 1-12
	 * @param {number} day
	 */
	DateTime.prototype.render = function(year, month, day) {
		var date = new Date();
		var yy = date.getFullYear(); //获取当前年份
		var mm = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
		var dd = date.getDate(); //获取当前日(1-31)
		var aWeek = ['日', '一', '二', '三', '四', '五', '六'];
	
		if (month > 12) {
			month = month % 12;
			year++;
		} else if (month < 1) {
			month = 12 - month % 12;
			year--;
		}
		
		var a = ''; //保存 gm_weekItem 节点的字符串
		for (var i = 0; i < aWeek.length; i++) {
			a += '<div gmTime="gm_weekItem">'+ aWeek[i] +'</div>';
		}
	
		var u = ''; //保存 gm_dayItem 节点的字符串
		var b = this.mGetDay(year, month, 1); //year month 1号是星期几, 是星期几就空几个格\
		var aT;
		if (this.selectDay) {
			aT = this.getAt(this.selectDay);
		}
		for (var i = 0; i < this.mGetDate(year, month) + b; i++) {
			if (i < b) {
				u += '<div gmTime="gm_dayItem"></div>';
			} else {
				// var isToday = (yy == year && mm == month && day == i - (b - 1));
				var isActive = aT ? (aT[0] == year && aT[1] == month && aT[2] == i - (b - 1)) : '';
				u += '<div gmTime="gm_dayItem" class="' + (isActive ? 'active' : '') + '">'+ [i - (b - 1)] +'</div>';
			}
		}
	
		//保存 gm_titleCon 节点的字符串
		this.now = year + '年' + month + '月' + day + '日';
	
		var temp_now = this.now.substring(0, this.now.indexOf('月') + 1);
	
		var d = '';
		for (var i = 0; i < 24; i++) {
			d += '<p gmTime="gm_hour">'+ (i < 10 ? '0' + i : i) +'</p>';
		}

		var s = '';
		for (var i = 0; i < 12; i++) {
			s += '<p gmTime="gm_second">'+ (((i * 5) > 5 ? i * 5 : '0' + i * 5)) +'</p>';
		}
	
		var hours = this.isShowHour ? '<div gmTime="gm_timepicker" onselectstart="return false";>时<div gmTime="d_wrap">'+ d +'</div></div>' : '';
		var seconds = this.isShowHour ? '<div gmTime="gm_timepicker" onselectstart="return false";>分<div gmTime="s_wrap">'+ s +'</div></div>' : '';
		var isShowHour = this.isShowHour ? 'showHour' : '';
		
		var str =   '<div gmTime="gm_time" '+ isShowHour +'>' +
						'<div gmTime="gm_title">' +
							'<div gmTime="gm_prevBtn">&lt;</div>' +
							'<div gmTime="gm_titleCon">'+ temp_now +'</div>' +
							'<div gmTime="gm_nextBtn">&gt;</div>' +
						'</div>' +
						'<div gmTime="gm_week" class="clearfix">'+ a +'</div>' + 
						'<div class="clearfix">' +
							'<div gmTime="gm_day" class="clearfix" onselectstart="return false;" >'+ u +'</div>' + 
							hours +
							seconds +
						'</div>' +
					'</div>';
		this.wrap.innerHTML = str;
	
	}
	
	
	/**
	 * 
	 * @param {number} year 
	 * @param {number} month 1-12
	 * 
	 * @return 返回某年某月的拥有的天数 
	 */
	DateTime.prototype.mGetDate = function(year, month){
		var d = new Date(year, month, 0);
		return d.getDate();
	}
	
	/**
	 * 
	 * @param {number} year 
	 * @param {number} month 1-12
	 * @param {number} day 1-31
	 * 
	 * @return 返回某年某月某日是星期几
	 */
	DateTime.prototype.mGetDay = function(year, month, day){
		var d = new Date(year + '-' + month + '-' + day);
		return d.getDay();
	}
	
	DateTime.prototype.act = function(ev) {
		var target = ev.target;
		var targetProp = target.getAttribute('gmTime');
		if (target.tagName.toLowerCase() == 'div' && targetProp == 'gm_dayItem' && target.innerHTML != '') {
			this.setSelectDay(target);
		} else if (targetProp == 'gm_nextBtn') {
			this.nextMonth();
		} else if (targetProp == 'gm_prevBtn') {
			this.prevMonth();
		} else if (targetProp == 'gm_hour') {
			this.setSelectHour(target);
		} else if (targetProp == 'gm_second') {
			this.setSelectSecond(target);
		}
	}
	
	DateTime.prototype.nextMonth = function() {
		var aT = this.getAt();
		this.render(aT[0], aT[1] + 1, aT[2]);
	}
	
	DateTime.prototype.prevMonth = function() {
		var aT = this.getAt();
		this.render(aT[0], aT[1] - 1, aT[2]);
	}
	
	/**
	 * @param {string} 可有可无
	 * @return {Array} 0 = year, 1 = month, 2 = day
	 */
	DateTime.prototype.getAt = function(str) {
		var d, aD;
		if (arguments.length == 0) {
			d = this.now;
			d = d.replace(/年|月|日/g,'/');
			aD = d.split('/');
		} else if (arguments.length == 1) {
			d = str;
			aD = d.split('-');
		}
		aD.length = 3;
		aD[0] = parseInt(aD[0]);
		aD[1] = parseInt(aD[1]);
		aD[2] = parseInt(aD[2]);
		return aD;
	}
	
	/**
	 * 
	 * @param {string} target 点击的DOM节点
	 */
	DateTime.prototype.setSelectDay = function(target) {
		var sDay = target.innerHTML;
		sDay = parseInt(sDay);
		var aT = this.getAt();
		this.selectDay = aT[0] + '-' + (aT[1] > 9 ? aT[1] : ('0'+ aT[1])) + '-' + (sDay > 9 ? sDay : ('0'+ sDay));
		
		var aGmItem = this.wrap.querySelectorAll('[gmTime="gm_dayItem"]');
	
		for (var i = 0; i < aGmItem.length; i++) {
			aGmItem[i].className = '';
		}
		target.className = 'active';
		
		if (!this.isShowHour) {
			this.selectHour = '00:00:00';
			this.useCallback();
		}
	}
	
	/**
	 * 
	 * @param {string} stime 将 '2015-03-05 17:59:00' 转成 时间戳
	 */
	DateTime.prototype.convert = function(sTime) {
		sTime = sTime.substring(0,19).replace(/-/g,'/');
		return new Date(sTime).getTime();
	}
	
	
	/**
	 * 
	 * @param {string} target 点击的DOM节点
	 * 
	 * callback在此处调用
	 * 
	 */
	
	DateTime.prototype.setSelectHour = function(target) {
		var sHour = target.innerHTML;
		var aGmHour = this.wrap.querySelectorAll('[gmTime="gm_hour"]');
	
		for (var i = 0; i < aGmHour.length; i++) {
			aGmHour[i].className = '';
		}
		target.className = 'active';

		console.log('时：', sHour);

		this.selectHour = sHour + ':00:00';
	}

	DateTime.prototype.setSelectSecond = function(target) {
		var sSecond = target.innerHTML;
		var aGmSecond = this.wrap.querySelectorAll('[gmTime="gm_second"]');
		for (var i = 0; i < aGmSecond.length; i++) {
			aGmSecond[i].className = '';
		}
		target.className = 'active';

		
		if (!this.selectHour) return alert('请先选择小时');
		console.log('selectHour', this.selectHour);

		console.log('分：', sSecond);

		this.selectHour = this.selectHour.replace(/:(\S*):/, ':'+ sSecond +':');
		this.useCallback();
	}
	
	DateTime.prototype.useCallback = function() {
		this.iTime = this.convert(this.selectDay + ' ' + this.selectHour);
		if (!!this.output || this.output == undefined) {
			var n = this.input.tagName.toLowerCase();
			var val = this.isShowHour ? this.selectDay + ' ' + this.selectHour : this.selectDay;
			if (n == 'input' || n == 'textarea') {
				this.input.value = val;
			} else {
				this.input.innerHTML = val;
			}
		}
		this.callback && this.callback(this.iTime);
		this.hide();
	}
	
	DateTime.prototype.show = function() {
		this.wrap.style.display = 'block';
		return this;
	}
	
	DateTime.prototype.hide = function() {
		this.wrap.style.display = 'none';
		return this;
	}

	if (typeof module !== 'undefined' && typeof exports === 'object') {
		module.exports = $_$DateTime;
	} else {
		window.$_$DateTime = $_$DateTime;
	}

})();

