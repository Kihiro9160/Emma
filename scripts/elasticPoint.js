/**
 * glue領域の点を変形させる処理に関する内部処理クラス.
 * src.coordinate.ConvertElasticPointGlueから呼び出される.
 * @author murase
 *
 */
function ElasticPoint() {
	
/**
 * 点を変形
 * @param aPoint ある点の座標(メルカトル座標系)
 * @param aCenterPoint 中心の座標(メルカトル座標系)
 * @param aOuterRatio glueの中でもどれくらいの位置にあるか(0~1)(0:glueの内側境界，1:glueの外側境界)
 * @param aGlueInnerLengthMercator 中心からglue内側までの長さ(球面メルカトル座標系)
 * @param aGlueOuterLengthMercator 中心からglue外側までの長さ(球面メルカトル座標系)
 * @param magnifyingPower 拡大率.
 * @param mercatorPerPixel 1pxあたりのメルカトル
 * @return 中心からどれだけ離れた位置に移動させるか(メルカトル座標系で)
 */
    this.calcElasticPoint = function (aPoint, aCenterPoint, aOuterRatio, aGlueInnerLengthMercator, aGlueOuterLengthMercator, magnifyingPower, mercatorPerPixel) {


        var glueInnerLengthMercator = aGlueInnerLengthMercator;
        var glueOuterLengthMercator = aGlueOuterLengthMercator;


        // 開始点，終了点，制御点の計算.
        var startPoint = {
            x: glueInnerLengthMercator / magnifyingPower,
            y: glueInnerLengthMercator
        };
        var endPoint = {
            x: glueOuterLengthMercator,
            y: glueOuterLengthMercator
        };
        var yd = endPoint.y - startPoint.y;
        var ydF = yd*magnifyingPower;
        var controlPoint1 = {
            x: startPoint.x + ydF*FOCUS_SIDE_SMOOTH_RATIO,
            y: startPoint.y + yd*FOCUS_SIDE_SMOOTH_RATIO
        };
        var controlPoint2 = {
            x: endPoint.x - yd * CONTEXT_SIDE_SMOOTH_RATIO,
            y: endPoint.y - yd * CONTEXT_SIDE_SMOOTH_RATIO
        };

 

        // 中心から対称点までの長さ.
        var pointLengthMercator = Math.hypot(aCenterPoint.x - aPoint.x, aCenterPoint.y - aPoint.y);
        // 中心からどれだけ離れた位置に移動するか.
        var movedLength = this.bezierCurve(aOuterRatio, startPoint, controlPoint1, controlPoint2, endPoint).y;
        // 元の点に対して移動した点の増加幅.
        var nobi = movedLength / pointLengthMercator;

        var move = {
            x: (aPoint.x - aCenterPoint.x) * nobi + aCenterPoint.x,
            y: (aPoint.y - aCenterPoint.y) * nobi + aCenterPoint.y
        };


        return move;
    };


        // 3次ベジェ曲線の数式
        // http://geom.web.fc2.com/geometry/bezier/cubic.html
        // 中学生でもわかるベジェ曲線
        // http://blog.sigbus.info/2011/10/bezier.html
        // Flashゲーム講座 & アクションスクリプトサンプル集
        // http://hakuhin.jp/as/curve.html
        /**
         * ベジェ曲線の計算(再配置関数)
         * @param t ベジェ曲線のパラメータ
         * @param p1　開始座標
         * @param p2　制御座標１
         * @param p3　制御座標２
         * @param p4　終了座標
         * @return
         */
        this.bezierCurve = function(t, p1, p2, p3, p4){
            var t2 = 1 - t;

            var point = {
                x: t2 * t2 * t2 * p1.x + 3 * t2 * t2 * t * p2.x + 3 * t2 * t * t * p3.x + t * t * t * p4.x,
                y: t2 * t2 * t2 * p1.y + 3 * t2 * t2 * t * p2.y + 3 * t2 * t * t * p3.y + t * t * t * p4.y
            };

            return point;
        };

}
