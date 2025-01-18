/**
 * イベント処理の初期設定
 * @constructor 
 * @classdesc マウスの移動に関するイベント処理
 * 
 */
function MouseMoveEvent(){
	var mouseMoveEvent = this;
	console.log(this);
	// glueの境界にいた時にそれを示すための処理？.
	$("#focus_glue_layer > *").mousemove(function(e){
		// focus,glue中心位置からのマウスポインタまでの距離.
		var r = Math.sqrt(
					Math.pow(e.pageX-($("#layer1").position().left)-g_GlobalStaticNumber.glueOuterRadius, 2) + 
					Math.pow(e.pageY-($("#layer1").position().top)-g_GlobalStaticNumber.glueOuterRadius, 2)
				);
		if(g_GlobalStaticNumber.glueOuterRadius-5 < r && r < g_GlobalStaticNumber.glueOuterRadius+5){	// glue外側境界付近にマウスポインタがある.
//			console.log("outer radius");
			// 外側の円の描画.
			mouseMoveEvent.drawCircle({x: g_GlobalStaticNumber.glueOuterRadius, y:g_GlobalStaticNumber.glueOuterRadius}, g_GlobalStaticNumber.glueOuterRadius-3);
			// glueの移動イベントをdisable
			$("#layer3").draggable( "disable" );
		}else if(g_GlobalStaticNumber.glueInnerRadius-5 < r && r < g_GlobalStaticNumber.glueInnerRadius+5){// glue内側境界付近にマウスポインタがある.
//			console.log("inner radius");
			// 内側の円の描画.
			mouseMoveEvent.drawCircle({x: g_GlobalStaticNumber.glueOuterRadius, y:g_GlobalStaticNumber.glueOuterRadius}, g_GlobalStaticNumber.glueInnerRadius-3);
			// glueの移動イベントをdisable
			$("#layer3").draggable( "disable" );
		}else{// それ以外.
			// 描画した円の削除.
			mouseMoveEvent.deleteCircle();
			// glueの移動イベントをdisable
			$("#layer3").draggable( "enable" );
		}
	});
	
	/**
	 * 円の描画
	 * @param xy {object} 描画する座標
	 * @param radius {Number} 半径
	 */
	this.drawCircle = function(xy, radius){
	    var canvas = document.getElementById('layer3');
	    if ( ! canvas || ! canvas.getContext ) { return false; }
	    var context = canvas.getContext('2d');
	    context.beginPath();
	    context.lineWidth = 5;
	    context.arc(xy.x, xy.y, radius, 0, Math.PI*2, false);
	    context.stroke();
	};
	
	/**
	 * 円の削除
	 */
	this.deleteCircle = function(){
	    var canvas = document.getElementById('layer3');
	    if ( ! canvas || ! canvas.getContext ) { return false; }
	    var context = canvas.getContext('2d');
	    context.clearRect(0, 0, 3000, 3000);
	};
}
