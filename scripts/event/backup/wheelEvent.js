/**
 * イベント設定
 * @constructor 
 * @classdesc  マウスホイールに関するイベント処理
 * 
 */
function WheelEvent(){
	/**
	 * Focus，Glueエリアでマウスホイール操作があった時はFocusの縮尺を変化させる.
	 */
	$("#focus_glue_layer > :last").mousewheel(function(eo, delta, deltaX, deltaY) {
		g_GlobalStaticNumber.focusScale = delta > 0 ? g_GlobalStaticNumber.focusScale+1 : g_GlobalStaticNumber.focusScale - 1;// 拡大:縮小.
		g_drawMap.drawFocusGlue();
	});
}


