/**
 * イベント処理の初期設定
 * @constructor 
 * @classdesc マウスの移動に関するイベント処理
 * 
 */
function MouseMoveEvent() {
    var mouseMoveEvent = this;
    //console.log(this);
    // glueの境界にいた時にそれを示すための処理？.
    $(document).on("mousemove click", ".focus_glue_layer", (function (e) {
        // focus,glue中心位置からのマウスポインタまでの距離.

        var circleLayer = $(this).find(".circle_layer").get(0);
        var glueLayer = $(this).find(".glue_layer");
        var focusLayer = $(this).find(".focus_layer");

        var r = Math.sqrt(
					Math.pow(e.pageX - (glueLayer.offset().left) - parseInt(glueLayer.width()) / 2, 2) +
					Math.pow(e.pageY - (glueLayer.offset().top) - parseInt(glueLayer.width()) / 2, 2)
				);

        //console.log($(this).offset());

        if (parseInt(glueLayer.width()) / 2 - 10 < r && r < parseInt(glueLayer.width()) / 2 - 2) {	// glue外側境界付近にマウスポインタがある.
            //console.log("outer radius");
            //map.dragging.disable();



            // 外側の円の描画.
            mouseMoveEvent.drawCircle(circleLayer, glueLayer.get(0), { x: parseInt(glueLayer.width()) / 2, y: parseInt(glueLayer.width()) / 2 }, parseInt(glueLayer.width()) / 2 - 3);
            // glueの移動イベントをdisable
            try{
                $(this).draggable("disable");
            }catch(e){}
        } else if (parseInt(focusLayer.width()) / 2 - 10 < r && r < parseInt(focusLayer.width()) / 2 + 10) {// glue内側境界付近にマウスポインタがある.
            //console.log("inner radius");
            //map.dragging.disable();



            // 内側の円の描画.
            mouseMoveEvent.drawCircle(circleLayer, focusLayer.get(0), { x: parseInt(focusLayer.width()) / 2, y: parseInt(focusLayer.width()) / 2 }, parseInt(focusLayer.width()) / 2 - 3);
            // glueの移動イベントをdisable
            try{
                $(this).draggable("disable");
            }catch(e){}
        } else {// それ以外.

            // 描画した円の削除.
            mouseMoveEvent.deleteCircle(circleLayer, glueLayer, focusLayer);
            // glueの移動イベントをdisable
            try{
                $(this).draggable("enable");
            } catch (e) { }
        }
    }));


    /**
	 * 円の描画
	 * @param xy {object} 描画する座標
	 * @param radius {Number} 半径
  	 * @param circleLayer {object} サイズ変更時に用いるサークルのHTML Element
   	 * @param glueLayer {object} Glue領域のHTML Element
	 */
    this.drawCircle = function (circleLayer, glueLayer, xy, radius) {

        circleLayer.style.left = glueLayer.style.left;
        circleLayer.style.top = glueLayer.style.top;

        circleLayer.style.width = xy.x * 2 + "px";
        circleLayer.style.height = xy.y * 2 + "px";

        circleLayer.style.zIndex = "3";
        var canvas = circleLayer;
        if (!canvas || !canvas.getContext) { return false; }
        canvas.width = xy.x * 2;
        canvas.height = xy.y * 2;


        //var context = canvas.getContext('2d');
        //context.beginPath();
        //context.lineWidth = 3;
        //context.arc(xy.x, xy.y, radius, 0, Math.PI*2, false);
        //context.stroke();

        $(glueLayer).css('box-shadow', '0px 0px 20px #777');
    };

    /**
	 * 円の削除
     * @param circleLayer {object} サイズ変更時に用いるサークルのHTML Element
   	 * @param glueLayer {object} Glue領域のHTML Element
   	 * @param focusLayer {object} Focus領域のHTML Element
	 */
    this.deleteCircle = function (circleLayer, glueLayer, focusLayer) {
        circleLayer.style.zIndex = "0";
        var canvas = circleLayer;
        if (!canvas || !canvas.getContext) { return false; }
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 3000, 3000);

        $(glueLayer).css('box-shadow', '');
        $(focusLayer).css('box-shadow', '');
    };
}
