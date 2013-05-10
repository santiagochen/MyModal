/*
* MyModal
* version: 0.0.1
* Date: 05/06/2013
* author: santiago chen
* email: santiago1209@foxmail.com
* more on https://github.com/santiagochen
*
* MyModal
* It is a Javascript Popup Modal Plugin. 
* Tested Browser: Firefox, Chrome, Safari, IE6-IE9.
*
* MyModal.modal({
* 		target: target/content is Required. Dom Selector: Identifier for domElement in page.it has higher priority than content.
* 		content: target/content is Required. String: Html Element.
* 		isdrag: Optional. Boolean: false as default. Decide whether it is permitted to dragged.
* 		overlayclose: Optional. Boolean: false as default. Decide whether it is permitted to close modal by click on somewhere else.
*		overlayalpha: Optional. Number: 0.1 is default;
*		zdepth: Optional. Number: 9999 is default.
* 		onclose: Optional. Function: eventHandler for close event.
* 		onopen: Optional. Function: eventHandler for open event.
*	})
* 
* MyModal.close()
*
*
*/

var MyModal = MyModal || {};

(function(window){
	
	var _target,
		_content,
		_isdrag = false,
		_dragstart = false,
		_overlayclose = false,
		_overlayalpha,
		_zdepth,
		_onclose,
		_onopen;
		
		//elements for creating modal;
		//data inserted in modal;
		var _modaldata;
		var _modal;
		var _dragbar, _dragoffsetX, _dragoffsetY,_tempclientX,_tempclientY;
		var _modalclose; //closeBtn in modal;
		
		//overlay around modal;
		var _modaloverlay; 
		//wrapper for modal;
		var _modalwrap;
		//inwrap for modal;
		var _modalinwrap;
	
	//MyModal.modal Handler
	MyModal.modal = function(param){
		//inititilize here
		_target = param.target||null;
		_content = param.content||null;
		_isdrag = param.isdrag||false;
		_overlayalpha = param.overlayalpha||0.1;
		_overlayclose = param.overlayclose||false;
		_zdepth = param.zdepth||9999;
		_onopen = param.onopen||null;
		_onclose = param.onclose||null;
		
		
		_modaldata = getmodaldata(_target,_content);
		
		if(_modaldata==null){
			throw "no elements in modal is found";
			}
		else{
			buildmodal(_modaldata)
			}
		
		}
	
	//MyModal.close Handler
	MyModal.close = function(){
		disappearmodal()
		}
		
	
	var getmodaldata = function(target,content){
		if(target!==null){
			return target.innerHTML;
			}
		else if(target==null){
			if(content!==null){
				return content;
				}
			else{
				return null
				}
			}
		}
		
	//build modal
	var buildmodal = function(data){
		_modal = factory.modal();
		_modal.innerHTML = data;
		
		_dragbar = factory.dragbar();
		_modalinwrap = factory.inwrap();
		_modalclose =  factory.modalclose();
		
		_modalinwrap.appendChild(_modal);
		
		_modalwrap =  factory.wrap();
		
		_modalwrap.appendChild(_modalclose);
		_modalwrap.appendChild(_dragbar);
		_modalwrap.appendChild(_modalinwrap);
		
		
		_modaloverlay = factory.overlay();
		
		displaymodal();
		
		}

	//display modalwrap and overlay;
	var displaymodal = function(){
		
		document.body.appendChild(_modaloverlay);
		
		document.body.appendChild(_modalwrap);
		
		var tempwidth = _modalwrap.getBoundingClientRect().width||_modalwrap.clientWidth,
			tempheight = _modalwrap.getBoundingClientRect().height||_modalwrap.clientHeight,
			pagewidth = document.documentElement.clientWidth,
			pageheight = document.documentElement.clientHeight,
			tempscrollX = getScroll().x,
			tempscrollY = getScroll().y;
			
		if(isIE6()==true){
			_modalwrap.style.left = ((pagewidth-tempwidth)/2+tempscrollX)+"px";
			_modalwrap.style.top = ((pageheight-tempheight)/2+tempscrollY)+"px";
			}
		else{
			_modalwrap.style.left = ((pagewidth-tempwidth)/2)+"px";
			_modalwrap.style.top = ((pageheight-tempheight)/2)+"px";
			}
		
		_tempclientX =(navigator.userAgent.indexOf("MSIE")>=0)?parseInt(_modalwrap.currentStyle.left):window.getComputedStyle(_modalwrap).left;
		_tempclientY =(navigator.userAgent.indexOf("MSIE")>=0)?parseInt(_modalwrap.currentStyle.top):window.getComputedStyle(_modalwrap).top;
		
		
		window.onscroll = function(){
			tempwidth = _modalwrap.getBoundingClientRect().width||_modalwrap.clientWidth,
			tempheight = _modalwrap.getBoundingClientRect().height||_modalwrap.clientHeight,
			pagewidth = document.documentElement.clientWidth,
			pageheight = document.documentElement.clientHeight,
			
			tempscrollX = getScroll().x,
			tempscrollY = getScroll().y;
			
			if(_isdrag==true){
				if(isIE6()==true){
					_modalwrap.style.left = (_tempclientX+tempscrollX)+"px";
					_modalwrap.style.top = (_tempclientY+tempscrollY)+"px";
					}
				else{
					_modalwrap.style.left = (_tempclientX)+"px";
					_modalwrap.style.top = (_tempclientY)+"px";	
					}	
				}
			else{
				if(isIE6()==true){
					_modalwrap.style.left = ((pagewidth-tempwidth)/2+tempscrollX)+"px";
					_modalwrap.style.top = ((pageheight-tempheight)/2+tempscrollY)+"px";
					}
				else{
					_modalwrap.style.left = ((pagewidth-tempwidth)/2)+"px";
					_modalwrap.style.top = ((pageheight-tempheight)/2)+"px";
					}
				}
			
			}
			
		window.onresize = function(){
			tempwidth = _modalwrap.getBoundingClientRect().width||_modalwrap.clientWidth,
			tempheight = _modalwrap.getBoundingClientRect().height||_modalwrap.clientHeight,
			pagewidth = document.documentElement.clientWidth,
			pageheight = document.documentElement.clientHeight,
			tempscrollX = getScroll().x,
			tempscrollY = getScroll().y;
			
			if(_isdrag==true){
				if(isIE6()==true){
					_modalwrap.style.left = (_tempclientX+tempscrollX)+"px";
					_modalwrap.style.top = (_tempclientY+tempscrollY)+"px";
					}
				else{
					_modalwrap.style.left = (_tempclientX)+"px";
					_modalwrap.style.top = (_tempclientY)+"px";	
					}
				}
			else{
				if(isIE6()==true){
					_modalwrap.style.left = ((pagewidth-tempwidth)/2+tempscrollX)+"px";
					_modalwrap.style.top = ((pageheight-tempheight)/2+tempscrollY)+"px";
					}
				else{
					_modalwrap.style.left = ((pagewidth-tempwidth)/2)+"px";
					_modalwrap.style.top = ((pageheight-tempheight)/2)+"px";
					}
				}
			
			}
		
      	addevents();
		
		//onopen callback setting here:
		if(_onopen!==null){
			_onopen()
			}
		
		}
	
	//disappear modal
	var disappearmodal = function(){
		document.body.removeChild(_modalwrap);
		document.body.removeChild(_modaloverlay);
		//onopen callback setting here:
		if(_onclose!==null){
			_onclose()
			}
		}
	
	var addevents = function(){
		
		_modalclose.onclick = function(){
			disappearmodal();
			}
		
		if(_overlayclose == true){
			_modaloverlay.onclick = function(){
				disappearmodal()
				}
			}
		
		
		if(_isdrag==true){
			_dragbar.style.cursor = "move";
			document.body.onmousemove = function(event){
				if(_dragstart == true){
					_dragbar.style.cursor = "move";
					var e = event||window.event;
					_modalwrap.style.left = (e.clientX-_dragoffsetX)+"px";
					_modalwrap.style.top = (e.clientY-_dragoffsetY)+"px";
					}
				}
			}
		
		_dragbar.onmousedown = function(event){
			var e = event||window.event;
			_dragstart = true;
			_dragoffsetX = parseInt(e.clientX)-parseInt(_modalwrap.style.left);
			_dragoffsetY = parseInt(e.clientY)-parseInt(_modalwrap.style.top);
			
			}
		
		document.documentElement.onmouseup = function(event){
			var e = event||window.event;
			_dragstart = false;
			_tempclientX =(navigator.userAgent.indexOf("MSIE")>=0)?parseInt(_modalwrap.currentStyle.left):window.getComputedStyle(_modalwrap).left;
			_tempclientY =(navigator.userAgent.indexOf("MSIE")>=0)?parseInt(_modalwrap.currentStyle.top):window.getComputedStyle(_modalwrap).top;
			}
		}
	
	//factory for all
	var factory = {
		//overlay factory
		overlay: function(){
			var temp = document.createElement("div");
			temp.style.display ="block";
			temp.style.opacity = _overlayalpha;
			temp.style.filter = "alpha(opacity="+_overlayalpha*100+")";
			temp.style.backgroundColor = "#000000";
			temp.style.width = document.body.clientWidth+"px";
			temp.style.height = document.body.clientHeight + "px";
			temp.style.position = (isIE6()==true)?"absolute":"fixed";
			temp.style.top = "0px";
			temp.style.left = "0px";
			temp.style.zIndex = _zdepth-1;
			temp.id = "mymodal-overlay";
			return temp;
			},
		//modal factory
		modal: function(){
			var temp = document.createElement("div");
			temp.style.display ="block";
			temp.style.margin = "0"
			temp.id = "mymodal";
			return temp;
			},
		//dragbar factory
		dragbar:function(){
			var temp = document.createElement("div");
			temp.style.display ="block";
			temp.style.height = "15px";
			temp.style.width = "100%";
			temp.style.margin = "0";
			temp.id = "mymodal-dragbar";
			return temp;
			},
		//inwrap factory
		inwrap: function(){
			var temp = document.createElement("div");
			temp.style.display ="block";
			temp.style.margin = "0 5px 5px 5px"
			temp.id = "mymodal-inwrap";
			return temp;
			},
		//wrap factory
		wrap: function(){
			var temp = document.createElement("div");
			temp.style.display ="block";
			temp.style.borderStyle = "solid"
			temp.style.borderWidth = "2px";
			temp.style.position = (isIE6()==true)?"absolute":"fixed";
			temp.style.zIndex = _zdepth;
			temp.id = "mymodal-wrap";
			return temp;
			},
		//modalclose factory	
		modalclose: function(){
			var temp = document.createElement("a");
			temp.style.display ="block";
			temp.style.position = "absolute";
			temp.style.cursor = "pointer"
			temp.style.color = "#ffffff";
			temp.innerHTML = "x";
			temp.id = "mymodal-close";
			return temp;
			}
		}
	
	var getScroll = function(){
		var tempscroll = {};
		if(window.navigator.appName.indexOf("Microsoft Internet Explorer")>=0){
			tempscroll.x = document.documentElement.scrollLeft;
			tempscroll.y = document.documentElement.scrollTop;
			}
		else if(window.navigator.userAgent.indexOf("Firefox")>=0){
			tempscroll.x = document.documentElement.scrollLeft;
			tempscroll.y = document.documentElement.scrollTop;
			}
		else{
			tempscroll.x = document.body.scrollLeft;
			tempscroll.y = document.body.scrollTop;
			}
		return tempscroll;
		}
	
	var isIE6 = function(){
		if(window.navigator.userAgent.indexOf("MSIE 6.0")>=0){
			return true;
			}
		else{
			return false
			}
		}
	
	})(window)