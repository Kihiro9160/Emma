"user strict";
$(window).resize(function() {

//	ResizeEvent.resizeWindow();
    //	console.log($(window).width());
    g_GlobalStaticNumber.windowSize = { x: $(window).width(), y: $(window).height() };
    var navSize = { x: $('.navbar').width(), y: $('.navbar').height() };
    // 地図の大きさを変える.
    //$('div#map_element').css('width',g_GlobalStaticNumber.windowSize.x);
    $('div#map_element').css('height', g_GlobalStaticNumber.windowSize.y - navSize.y - 16);

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
    this.resizeWindow = function () {
        console.info("resize");
        g_GlobalStaticNumber.windowSize = { x: $(window).width(), y: $(window).height() };
        var navSize = { x: $('.navbar').width(), y: $('.navbar').height() };
		// 地図の大きさを変える.
		//$('div#map_element').css('width',g_GlobalStaticNumber.windowSize.x);
		$('div#map_element').css('height',g_GlobalStaticNumber.windowSize.y - navSize.y - 16);

	};
}