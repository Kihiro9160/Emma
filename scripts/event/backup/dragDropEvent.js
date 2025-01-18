/**
 * イベント処理の初期設定
 * @constructor 
 * @classdesc ドラッグ，ドロップに関するイベント処理
 * 
 */
function DragDropEvent(){
	this.last = 0;	// 最後にglueを更新した時刻.
	this.diff = 0;	// 最後にglueを更新してからの何m秒たったか.
	var dragDropEvent = this;
	
	/**
	 * focus glue をドラッグしたときの処理
	 * 
	 * jquery ui draggableを使ったドロップ＆ドラッグ.
	 * 複数要素を同時にドラッグ(http://uenomemo.blog31.fc2.com/blog-entry-667.html).
	 * 
	 */
	$("#focus_glue_layer > :last").draggable({
		start: function(event, ui){
			$("#focus_glue_layer > *").each(function(){
				var apos = {	// クリックしたオブジェクトの位置とそれに付随するオブジェクトの位置のずれ.
						top:$(this).position().top-ui.position.top,
						left:$(this).position().left-ui.position.left
				};
				$(this).data("apos", apos);
				var initPosition = {	// クリックした位置を記憶しておく.
						top:$(this).position().top,
						left:$(this).position().left
				};
				$(this).data("initPosition", initPosition);
			});
		},
		drag: function(event, ui){
			var r = Math.sqrt(// glue中心位置からのマウスポインタまでの距離.
					Math.pow(event.pageX-($("#layer1").position().left)-g_GlobalStaticNumber.glueOuterRadius, 2) + 
					Math.pow(event.pageY-($("#layer1").position().top)-g_GlobalStaticNumber.glueOuterRadius, 2)
				);
			$("#focus_glue_layer > *").each(function(){	// ドラッグしている要素に付随するオブジェクトについて.
				$(this).css({	// 一緒に移動させる.
					top:ui.position.top+$(this).data("apos").top,
					left:ui.position.left+$(this).data("apos").left
				});
			});
			// glueの更新.
			if(dragDropEvent.isUpdate(event, GLUE_UPDATE_INTARVAL)){
				g_GlobalStaticNumber.gluePositionXy = {x: $("#layer1").position().left , y:  $("#layer1").position().top};
				g_drawMap.drawFocusGlue();
			}
		},
		// glueの更新.
		stop:function(event, ui){
			g_GlobalStaticNumber.gluePositionXy = {x: $("#layer1").position().left , y:  $("#layer1").position().top};
			g_drawMap.drawFocusGlue();
		}
	});
	
	/**
	 * glueの大きさ変更に関するイベント(ドロップ，ドラッグ操作)
	 */
	this.changeRadiusEvent = function(){
		var dragDropEvent = this;
		var glueInnerOverFlg = false;
		var glueOuterOverFlg = false;
		// 独自のドロップ＆ドラッグ処理(http://ascii.jp/elem/000/000/478/478300/).
		// glueの大きさを変える.
		/////////////////////////////
		//////////// ドラッグ開始.///////
		/////////////////////////////
		$("#layer3").on("mousedown", function(e){
//	        console.log("mousedown aaaa");
		});
		$("#layer3").on("mousedown", function(e){
			console.log("mousedown");
			// クリックした場所の座標（layer3内での相対座標)を覚えておく.
			$("#layer3")
				.data("clickPointX" , e.pageX - Number.parseInt($("#layer3").position().left, 10))
					.data("clickPointY" , e.pageY - Number.parseInt($("#layer3").position().top, 10));
			//console.log("init x "+(e.pageX - Number.parseInt($("#layer3").position().left, 10))+" init y "+(e.pageY - Number.parseInt($("#layer3").position().top, 10)));
			var xy = {x: e.pageX - Number.parseInt($("#layer3").position().left)-g_GlobalStaticNumber.glueOuterRadius ,
					y:e.pageY - Number.parseInt($("#layer3").position().top)-g_GlobalStaticNumber.glueOuterRadius};// glue原点としたときのxy座標.
			var r = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2));// その長さ.
			// マウスポインタがglue境界にあればglueの大きさ変更できるようにする.
			glueOuterOverFlg = false;
			glueInnerOverFlg = false;
			if(g_GlobalStaticNumber.glueOuterRadius-5 < r && r < g_GlobalStaticNumber.glueOuterRadius+5){// glue外側境界付近にマウスポインタがある.
				glueOuterOverFlg = true;
			}else if(g_GlobalStaticNumber.glueInnerRadius-5 < r && r < g_GlobalStaticNumber.glueInnerRadius+5){// glue内側境界付近にマウスポインタがある.
				glueInnerOverFlg = true;
			}else{
				return
			}
			/////////////////////////////
			////////////ドラッグ中//////////
			/////////////////////////////
			$(document).on("mousemove", function(e){
				// mousemoveしているときの座標(layer3の左上の絶対座標).
				//		console.log(""+(e.pageX  - $("#layer3").data("clickPointX"))+"px   " + (e.pageY - $("#layer3").data("clickPointY")+"px"));
				var xy = {x: e.pageX - Number.parseInt($("#layer3").position().left)-g_GlobalStaticNumber.glueOuterRadius ,
		 		y:e.pageY - Number.parseInt($("#layer3").position().top)-g_GlobalStaticNumber.glueOuterRadius};// glue中心からの距離.
				var r = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2));	// その長さ.
				if(glueOuterOverFlg && dragDropEvent.isUpdate(e, GLUE_CHANGE_RADIUS_INTARVAL)){
					dragDropEvent.changeGlueOuterRadiusNotGlue(Number.parseInt(r-g_GlobalStaticNumber.glueOuterRadius));	// glue外側境界の大きさを変える.
				}else if (glueInnerOverFlg && dragDropEvent.isUpdate(e, FOCUS_UPDATE_INTARVAL)){
					dragDropEvent.changeGlueInnerRadius(Number.parseInt(r-g_GlobalStaticNumber.glueInnerRadius));	// glue内側境界の大きさを変える.
				}

			});
			/////////////////////////////
			///////////ドラッグ終了//////////
			/////////////////////////////
		}).on("mouseup", function(e){
			console.log("mouseup");
			var xy = {x: e.pageX - Number.parseInt($("#layer3").position().left)-g_GlobalStaticNumber.glueOuterRadius ,
				y:e.pageY - Number.parseInt($("#layer3").position().top)-g_GlobalStaticNumber.glueOuterRadius};// glue中心からの距離.
			var r = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2));	// その長さ.
			if(glueOuterOverFlg){
				dragDropEvent.changeGlueOuterRadius(Number.parseInt(r-g_GlobalStaticNumber.glueOuterRadius));	// glue外側境界の大きさを変える.
			}else if (glueInnerOverFlg){
				dragDropEvent.changeGlueInnerRadius(Number.parseInt(r-g_GlobalStaticNumber.glueInnerRadius));	// glue内側境界の大きさを変える.
			}
			$(document).off("mousemove");
		});
	};
	
	/**
	 * 更新可能か
	 * @param e {Object} イベント
	 * @param interval {Number} Glueの更新間隔(ms?)
	 * @return {boolen} trueなら更新可能
	 */
	this.isUpdate = function(e, interval){
		this.diff = e.timeStamp - this.last;
		if(this.diff > interval){	// 一定時間ごとにglue更新
			this.last=e.timeStamp;
			return true;
		}
		else return false;
	};
	
	/**
	 * glue外側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueOuterRadius = function(changeRadius){
		this.changeGlueOuterRadiusNotGlue(changeRadius);
		g_drawMap.drawFocusGlue();
		
	};
	/**
	 * glue外側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueOuterRadiusNotGlue = function(changeRadius){
		var buttonEvent = this;
		g_GlobalStaticNumber.glueOuterRadius += changeRadius;	// 指定した分大きさを変える.
		var top = Number.parseInt($(".glueOuterSize").css("top").slice(0,-2), 10);
		var left = Number.parseInt($(".glueOuterSize").css("left").slice(0,-2), 10);
		g_GlobalStaticNumber.gluePositionXy = {x: left-changeRadius , y: top-changeRadius};	// g_globalStaticNumberの値を更新する.
		$(".glueOuterSize").each(function(){	// 各glueサイズのオブジェクトに対して大きさを大きくする処理をする.
//			$(this).width(g_GlobalStaticNumber.glueOuterRadius*2);
//			$(this).height(g_GlobalStaticNumber.glueOuterRadius*2);
			$(this).css('width',  g_GlobalStaticNumber.glueOuterRadius*2+"px");
			$(this).css('height', g_GlobalStaticNumber.glueOuterRadius*2+"px");
			$(this).css('border-radius', g_GlobalStaticNumber.glueOuterRadius*2+"px");
			$(this).attr('width', g_GlobalStaticNumber.glueOuterRadius*2);
			$(this).attr('height', g_GlobalStaticNumber.glueOuterRadius*2);
			$(this).css('top', (top-changeRadius)+"px");
			$(this).css('left', (left-changeRadius)+"px");
		});
	};
	
	/**
	 * glue内側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueInnerRadius = function(changeRadius){
		var buttonEvent = this;
		var g_ = g_GlobalStaticNumber;
		g_GlobalStaticNumber.glueInnerRadius += changeRadius;	// 指定した分大きさを変える.
		var top = Number.parseInt($(".glueInnerSize").css("top").slice(0,-2), 10);
		var left = Number.parseInt($(".glueInnerSize").css("left").slice(0,-2), 10);
		$(".glueInnerSize").each(function(){
//			$(this).width(g_GlobalStaticNumber.glueInnerRadius*2);
//			$(this).height(g_GlobalStaticNumber.glueInnerRadius*2);
			$(this).css('width',g_GlobalStaticNumber.glueInnerRadius*2+"px");
			$(this).css('height',g_GlobalStaticNumber.glueInnerRadius*2+"px");
			$(this).css('border-radius',g_GlobalStaticNumber.glueInnerRadius*2+"px");
			$(this).attr('width', g_GlobalStaticNumber.glueInnerRadius*2);
			$(this).attr('height', g_GlobalStaticNumber.glueInnerRadius*2);
			$(this).css('top', (top-changeRadius)+"px");
			$(this).css('left', (left-changeRadius)+"px");
		});
		g_drawMap.drawFocusGlue();
	};
}

