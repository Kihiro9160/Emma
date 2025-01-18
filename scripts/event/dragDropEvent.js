/**
 * イベント処理の初期設定
 * @constructor
 * @classdesc ドラッグ，ドロップに関するイベント処理
 *
 */
function DragDropEvent() {
	this.last = 0;	// 最後にglueを更新した時刻.
	this.diff = 0;	// 最後にglueを更新してからの何m秒たったか.
	var dragDropEvent = this;

	/**
	 * glueの大きさ変更に関するイベント(ドロップ，ドラッグ操作)
	 */
	this.changeRadiusEvent = function () {
		var dragDropEvent = this;
		var glueInnerOverFlg = false;
		var glueOuterOverFlg = false;
		// 独自のドロップ＆ドラッグ処理(http://ascii.jp/elem/000/000/478/478300/).
		// glueの大きさを変える.
		/////////////////////////////
		//////////// ドラッグ開始.///////
		/////////////////////////////

		$(document).on("mousedown", ".focus_glue_layer", function (e) {
			//console.log("mousedown");
			// クリックした場所の座標（layer3内での相対座標)を覚えておく.
			var circleLayer = $(this).find(".circle_layer");

			circleLayer
			.data("clickPointX", e.pageX - Number.parseInt(circleLayer.offset().left, 10))
			.data("clickPointY", e.pageY - Number.parseInt(circleLayer.offset().top, 10));
			//console.log("init x "+(e.pageX - Number.parseInt($("#layer3").position().left, 10))+" init y "+(e.pageY - Number.parseInt($("#layer3").position().top, 10)));
			var xy = {
					x: e.pageX - Number.parseInt(circleLayer.offset().left) - Number.parseInt(circleLayer.width())/2,
					y: e.pageY - Number.parseInt(circleLayer.offset().top) - Number.parseInt(circleLayer.height())/2
			};// glue原点としたときのxy座標.
			var r = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2));// その長さ.



			// マウスポインタがglue境界にあればglueの大きさ変更できるようにする.
			glueOuterOverFlg = false;
			glueInnerOverFlg = false;

			var glueLayer = $(this).find(".glue_layer");
			var focusLayer = $(this).find(".focus_layer");


			if (Number.parseInt(glueLayer.width()) / 2 - 10 < r && r < Number.parseInt(glueLayer.width()) / 2 + 5) {// glue外側境界付近にマウスポインタがある.
				glueOuterOverFlg = true;
			} else if (Number.parseInt(focusLayer.width()) / 2 - 10 < r && r < Number.parseInt(focusLayer.width()) / 2 + 10) {// glue内側境界付近にマウスポインタがある.
				glueInnerOverFlg = true;
			} else {
				return
			}
			/////////////////////////////
			////////////ドラッグ中//////////
			/////////////////////////////
			$(document).on("mousemove.drag", function (e) {

				map.dragging.disable();

				// mousemoveしているときの座標(layer3の左上の絶対座標).
				//		console.log(""+(e.pageX  - $("#layer3").data("clickPointX"))+"px   " + (e.pageY - $("#layer3").data("clickPointY")+"px"));
				var xy = {
						x: e.pageX - Number.parseInt(circleLayer.offset().left) - Number.parseInt(circleLayer.width()) / 2,
						y: e.pageY - Number.parseInt(circleLayer.offset().top) - Number.parseInt(circleLayer.height()) / 2
				};// glue中心からの距離.
				var r = Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2));	// その長さ.

				//console.info(r);
				if (glueOuterOverFlg && dragDropEvent.isUpdate(e, GLUE_CHANGE_RADIUS_INTARVAL)) {
					if ($("#expansion_focus_glue").val() == "all_together") {
						dragDropEvent.changeGlueInnerOuterRadius(focusLayer, glueLayer,Number.parseInt(r - glueLayer.width() / 2));	// glue内側外側境界の大きさを変える.
						$(focusLayer).attr('fgRatio',focusLayer.width()/glueLayer.width());
					}
					else if ($("#expansion_focus_glue").val() == "ratio"){
						dragDropEvent.changeGlueFocusRadiusRatio(focusLayer, glueLayer,Number.parseInt(r - glueLayer.width() / 2));	// glue内側外側境界の大きさを変える.
					}
					else {dragDropEvent.changeGlueOuterRadiusNotGlue(glueLayer, Number.parseInt(r - glueLayer.width() / 2));	// glue外側境界の大きさを変える.
					$(focusLayer).attr('fgRatio',focusLayer.width()/glueLayer.width());
					}
				} else if (glueInnerOverFlg && dragDropEvent.isUpdate(e, FOCUS_UPDATE_INTARVAL)) {
					if ($("#expansion_focus_glue").val() == "all_together") {
						dragDropEvent.changeGlueInnerOuterRadius(focusLayer, glueLayer, Number.parseInt(r - focusLayer.width() / 2));	// glue内側外側境界の大きさを変える.
						$(focusLayer).attr('fgRatio',focusLayer.width()/glueLayer.width());
					}
					else if ($("#expansion_focus_glue").val() == "ratio"){
						dragDropEvent.changeGlueFocusRadiusRatio(focusLayer, glueLayer,Number.parseInt(r - focusLayer.width() / 2));	// glue内側外側境界の大きさを変える.
					}
					else {dragDropEvent.changeGlueInnerRadius(focusLayer, Number.parseInt(r - focusLayer.width() / 2));	// glue内側境界の大きさを変える.
					$(focusLayer).attr('fgRatio',focusLayer.width()/glueLayer.width());
					}
				}
				$(focusLayer).attr('originalSize',focusLayer.width());
				$(glueLayer).attr('originalSize',glueLayer.width());


			});
			/////////////////////////////
			///////////ドラッグ終了//////////
			/////////////////////////////
		}).on("mouseup",function (e) {

			glueOuterOverFlg = false;
			glueInnerOverFlg = false;

			map.dragging.enable();

			$(document).off(".drag");

		});
	};

	/**
	 * 更新可能か
	 * @param e {Object} イベント
	 * @param interval {Number} Glueの更新間隔(ms?)
	 * @return {boolen} trueなら更新可能
	 */
	this.isUpdate = function (e, interval) {
		this.diff = e.timeStamp - this.last;
		if (this.diff > interval) {	// 一定時間ごとにglue更新
			this.last = e.timeStamp;
			return true;
		}
		else return false;
	};

	/**
	 * glue外側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueOuterRadius = function (glueLayer ,changeRadius) {
		this.changeGlueOuterRadiusNotGlue(glueLayer, changeRadius);

	};
	/**
	 * glue外側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueOuterRadiusNotGlue = function (glueLayer, changeRadius) {
		var buttonEvent = this;
		var top = parseInt(glueLayer.css("top"));
		var left = parseInt(glueLayer.css("left"));

		var glueOuterRadius = parseInt(glueLayer.width())/2 + changeRadius;

		g_GlobalStaticNumber.gluePositionXy = { x: left - changeRadius, y: top - changeRadius };	// g_globalStaticNumberの値を更新する.
//		各glueサイズのオブジェクトに対して大きさを大きくする処理をする.

		$(glueLayer).css('width', glueOuterRadius * 2 + "px");
		$(glueLayer).css('height', glueOuterRadius * 2 + "px");
		$(glueLayer).css('border-radius', glueOuterRadius * 2 + "px");
		$(glueLayer).attr('width', glueOuterRadius * 2);
		$(glueLayer).attr('height', glueOuterRadius * 2);
		$(glueLayer).css('top', (top - changeRadius) + "px");
		$(glueLayer).css('left', (left - changeRadius) + "px");
	};

	/**
	 * glue内側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueInnerRadius = function (focusLayer, changeRadius) {
		var buttonEvent = this;
		var glueInnerRadius = parseInt(focusLayer.width()) / 2 + changeRadius;// 指定した分大きさを変える.
		var top = parseInt(focusLayer.css("top"));
		var left = parseInt(focusLayer.css("left"));

		$(focusLayer).css('width', glueInnerRadius * 2 + "px");
		$(focusLayer).css('height', glueInnerRadius * 2 + "px");
		$(focusLayer).css('border-radius', glueInnerRadius * 2 + "px");
		$(focusLayer).attr('width', glueInnerRadius * 2);
		$(focusLayer).attr('height', glueInnerRadius * 2);
		$(focusLayer).css('top', (top - changeRadius) + "px");
		$(focusLayer).css('left', (left - changeRadius) + "px");
	};

	/**
	 * glue内側と外側の大きさを変える
	 * @param changeRadius {Number} 変更後のGlueの外側半径. changeRadiusが正なら大きく，負なら小さく.
	 */
	this.changeGlueInnerOuterRadius = function (focusLayer, glueLayer, changeRadius) {
		var buttonEvent = this;
		var glueInnerRadius = parseInt(focusLayer.width()) / 2 + changeRadius;// 指定した分大きさを変える.
		var top = parseInt(focusLayer.css("top"));
		var left = parseInt(focusLayer.css("left"));

		$(focusLayer).css('width', glueInnerRadius * 2 + "px");
		$(focusLayer).css('height', glueInnerRadius * 2 + "px");
		$(focusLayer).css('border-radius', glueInnerRadius * 2 + "px");
		$(focusLayer).attr('width', glueInnerRadius * 2);
		$(focusLayer).attr('height', glueInnerRadius * 2);
		if(parseInt(focusLayer.width()) == 0){
			top = parseInt(glueLayer.css("top")) + parseInt(glueLayer.width())/2;
			left = parseInt(glueLayer.css("left")) + parseInt(glueLayer.width())/2;
		}
		$(focusLayer).css('top', (top - changeRadius) + "px");
		$(focusLayer).css('left', (left - changeRadius) + "px");
		top = parseInt(glueLayer.css("top"));
		left = parseInt(glueLayer.css("left"));

		var glueOuterRadius = parseInt(glueLayer.width()) / 2 + changeRadius;

		$(glueLayer).css('width', glueOuterRadius * 2 + "px");
		$(glueLayer).css('height', glueOuterRadius * 2 + "px");
		$(glueLayer).css('border-radius', glueOuterRadius * 2 + "px");
		$(glueLayer).attr('width', glueOuterRadius * 2);
		$(glueLayer).attr('height', glueOuterRadius * 2);
		$(glueLayer).css('top', (top - changeRadius) + "px");
		$(glueLayer).css('left', (left - changeRadius) + "px");

	};

	this.changeGlueFocusRadiusRatio = function (focusLayer, glueLayer, changeRadius) {
		var buttonEvent = this;
		var ratio = $(focusLayer).attr('fgRatio');
		var glueInnerRadius = parseInt(focusLayer.width()) / 2 + changeRadius;
		var glueOuterRadius = Math.floor(glueInnerRadius/ratio);// 指定した分大きさを変える.

		var top = parseInt(focusLayer.css("top"));
		var left = parseInt(focusLayer.css("left"));
		$(focusLayer).css('width', glueInnerRadius * 2 + "px");
		$(focusLayer).css('height', glueInnerRadius * 2 + "px");
		$(focusLayer).css('border-radius', glueInnerRadius * 2 + "px");
		$(focusLayer).attr('width', glueInnerRadius * 2);
		$(focusLayer).attr('height', glueInnerRadius * 2);
		if(parseInt(focusLayer.width()) == 0){
			top = parseInt(glueLayer.css("top")) + parseInt(glueLayer.width())/2;
			left = parseInt(glueLayer.css("left")) + parseInt(glueLayer.width())/2;
		}
		$(focusLayer).css('top', (top - changeRadius) + "px");
		$(focusLayer).css('left', (left - changeRadius) + "px");

		top = parseInt(focusLayer.css("top"));
		left = parseInt(focusLayer.css("left"));



		$(glueLayer).css('width', glueOuterRadius * 2 + "px");
		$(glueLayer).css('height', glueOuterRadius * 2 + "px");
		$(glueLayer).css('border-radius', glueOuterRadius * 2 + "px");
		$(glueLayer).attr('width', glueOuterRadius * 2);
		$(glueLayer).attr('height', glueOuterRadius * 2);
		var margin =  glueLayer.width()/2 - focusLayer.width()/2;
		$(glueLayer).css('top', (top - margin) + "px");
		$(glueLayer).css('left', (left - margin) + "px");




	};


}

