"user strict";
$(window).resize(function() {

	ResizeEvent.prototype.resizeWindow();
//	console.log($(window).width());
});

/**
 * 特になし
 * @constructor 
 * @classdesc  リサイズイベントの取得
 * 
 */
function ResizeEvent(){
	/**
	 * ウインドウサイズに応じてレイアウトを動的に変更
	 */
	this.resizeWindow = function (){
		g_GlobalStaticNumber.windowSize = {x:$(window).width(), y:$(window).height()};
		// 地図の大きさを変える.
		$('div#map_element').css('width',g_GlobalStaticNumber.windowSize.x);
		$('div#map_element').css('height',g_GlobalStaticNumber.windowSize.y);
		// glueの画像の位置を変える.
		$('#layer1').css('left', ""+(Math.floor(g_GlobalStaticNumber.windowSize.x/2)-g_GlobalStaticNumber.glueOuterRadius)+"px");
		$('#layer1').css('top' , ""+(Math.floor(g_GlobalStaticNumber.windowSize.y/2)-g_GlobalStaticNumber.glueOuterRadius)+"px");
		// glueの画像の位置を変える.
		$("#focus_glue_layer > *").each(function(){
			$(this).css('left', ""+(Math.floor(g_GlobalStaticNumber.windowSize.x/2)-g_GlobalStaticNumber.glueOuterRadius)+"px");
			$(this).css('top' , ""+(Math.floor(g_GlobalStaticNumber.windowSize.y/2)-g_GlobalStaticNumber.glueOuterRadius)+"px");
		});
		
		// focusの画像の位置を変える.
		$('#layer2').css('left', ""+(Math.floor(g_GlobalStaticNumber.windowSize.x/2)-g_GlobalStaticNumber.glueInnerRadius)+"px");
		$('#layer2').css('top' , ""+(Math.floor(g_GlobalStaticNumber.windowSize.y/2)-g_GlobalStaticNumber.glueInnerRadius)+"px");
	};
}