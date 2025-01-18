


/**
 * 初期処理
 */
$(function(){
// ウインドウサイズを設定する.
resizeEvent = new ResizeEvent();
resizeEvent.resizeWindow();
// 初期のglueの位置設定.
g_GlobalStaticNumber.gluePositionXy={
		x:(Math.floor(g_GlobalStaticNumber.windowSize.x/2)-g_GlobalStaticNumber.glueOuterRadius), 
		y:(Math.floor(g_GlobalStaticNumber.windowSize.y/2)-g_GlobalStaticNumber.glueOuterRadius)};
});



/**
 * グローバル変数
 */
/** glueの更新間隔(ms) */
var GLUE_UPDATE_INTARVAL = 100;
/** focusの更新間隔 */
const FOCUS_UPDATE_INTARVAL = 100;
/** glueの大きさ変更間隔 */
const GLUE_CHANGE_RADIUS_INTARVAL = 100;
/** focus-glue間の滑らかさ(0～1) */
const FOCUS_SIDE_SMOOTH_RATIO = 0.4;
/** context-glue間の滑らかさ(0～1) */
const CONTEXT_SIDE_SMOOTH_RATIO = 0.2;
/** dragDropEventクラスのグローバルなインスタンス */
var g_dragDropEvent;
/** mouseMoveEventクラスのグローバルなインスタンス */
var g_mouseMoveEvent;
/** resizeEventクラスのグローバルなインスタンス */
var g_resizeEvent;
/** searchEventクラスのグローバルなインスタンス */
var g_searchEvent;
/** drawMapクラスのグローバルなインスタンス */
var g_drawMap;
/** holdEventクラスのグローバルなインスタンス */
var g_holdEvent;
/** changeLocationクラスのグローバルなインスタンス */
var g_location;
/** latLngMercatorUtilityクラスのグローバルなインスタンス */
var g_latLngMercatorUtility;
/** elasticPointクラスのグローバルなインスタンス */
var g_elasticPoint;
/** convertElasticPointsクラスのグローバルなインスタンス */
var g_convertElasticPoints;






/**
 * 初期処理
 */
$(function(){
	g_dragDropEvent = new DragDropEvent();
	g_dragDropEvent.changeRadiusEvent();
	g_mouseMoveEvent = new MouseMoveEvent();
	g_resizeEvent = new ResizeEvent();
	g_resizeEvent = new ResizeEvent();
	g_resizeEvent = new ResizeEvent();
	g_searchEvent = new searchEvent();
	g_buttonEvent = new ButtonEvent();
	g_drawMap = new DrawMap();
	g_holdEvent = new HoldEvent();
	g_location = new Location();
	g_latLngMercatorUtility = new LatLngMercatorUtility();
	g_elasticPoint = new ElasticPoint();
	g_convertElasticPoints = new ConvertElasticPoints();

});

