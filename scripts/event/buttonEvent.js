/**
 * ボタンを押したときのイベント
 */
function ButtonEvent(){
	/**
	 * フォーカスの表示範囲を変えずにスケールアップする
	 * focusのズームレベルを1段上げてGlueの半径を倍にする
	 */
	$('#scale_up_button').click(function(e){
		// focusスケール1段上げる.
//		console.log(g_GlobalStaticNumber.focusScale);
		g_GlobalStaticNumber.focusScale = g_GlobalStaticNumber.focusScale + 1;
//		console.log(g_GlobalStaticNumber.focusScale);
		// 半径2倍
		//g_dragDropEvent.changeGlueOuterRadiusNotGlue(g_GlobalStaticNumber.glueOuterRadius);
		//g_dragDropEvent.changeGlueInnerRadius(g_GlobalStaticNumber.glueInnerRadius);
		// 描画
		g_drawMap.drawFocusGlue();
	});
	
	/**
	 * フォーカスの表示範囲を変えずにスケールダウンする
	 * focusのズームレベルを1段下げてGlueの半径を半分
	 */
	$('#scale_down_button').click(function(e){
		// focusスケール1段上げる.
//		console.log(g_GlobalStaticNumber.focusScale);
		g_GlobalStaticNumber.focusScale = g_GlobalStaticNumber.focusScale - 1;
//		console.log(g_GlobalStaticNumber.focusScale);
		// 半径2倍
		//g_dragDropEvent.changeGlueOuterRadiusNotGlue(Math.ceil(-1*(g_GlobalStaticNumber.glueOuterRadius/2)));
		//g_dragDropEvent.changeGlueInnerRadius(Math.ceil(-1*(g_GlobalStaticNumber.glueInnerRadius/2)));
		// 描画
		g_drawMap.drawFocusGlue();
	});
}
