/**
 * Diagrama de Caso de uso
 *
 * @namespace
 */
var Workflow = {};

/**
 * Simbolo de Caso de uso
 *
 * @class
 * @memberof Workflow
 * @augments Common.Symbol
 */
Workflow.Process = Loira.util.createClass(Common.Symbol, {
    /**
     *
     * @memberof Workflow.Process#
     * @param options
     */
    initialize : function(options){
        this.callSuper('initialize', options);
        
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'process';
        this.borders = {
            bottomLeft: 0,
            topLeft: 0,
            topRight: 0,
            bottomRight: 0
        };

        this.recalculateBorders();

        this.maxOutGoingRelation = 1;
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @memberof Workflow.Process#
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym, points){
        var angle = Math.atan(ym / xm);

        if (xm<0){
            angle += Math.PI;
        }

        var result = {x:100, y:this.y-10};

        if ((angle > this.borders.bottomLeft && angle < this.borders.topLeft) || (angle > this.borders.topRight && angle < this.borders.bottomRight)){
            result = Loira.util.intersectPointLine(points, {x1:this.x, y1:-100, x2:this.x, y2:100});
        }else{
            result = Loira.util.intersectPointLine(points, {x1:-100, y1:this.y, x2:100, y2:this.y});
        }

        var x = result.x - (this.x + this.width/2);
        var y = result.y - (this.y + this.height/2);

        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    },
    /**
     * Recalcula los bordes del objeto
     *
     * @memberof Workflow.Process#
     */
    recalculateBorders: function(){
        var xm = Math.round(this.width /2),
            ym = Math.round(this.height /2);

        this.borders.bottomLeft = Math.atan(-ym / xm);
        this.borders.topLeft = Math.atan(ym / xm);
        this.borders.topRight = Math.atan(ym / -xm) + Math.PI;
        this.borders.bottomRight = Math.atan(-ym / -xm) + Math.PI;
    }
});

Workflow.Terminator = Loira.util.createClass(Common.Symbol, {
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x +20;
        var y = this.y;
        var xw = this.x + this.width - 20;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(x, y);

        ctx.lineTo(xw, y);

        ctx.bezierCurveTo(xw + 30, y, xw + 30, yh, xw, yh);

        ctx.lineTo(x, yh);

        ctx.bezierCurveTo(x - 30, yh, x -30, y, x, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym){
        var a = this.width/2;
        var b = this.height/2;
        var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

        return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
    }
}, true);

Workflow.StartTerminator = Loira.util.createClass(Workflow.Terminator, {
    initialize : function(options){
        this.callSuper('initialize', options);

        this.width = 70;
        this.height = 30;
        this.text = options.text;
        this.startPoint = true;
        this.maxOutGoingRelation = 1;

        this.type = 'start_terminator';
    }
});

Workflow.EndTerminator = Loira.util.createClass(Workflow.Terminator, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 70;
        this.height = 30;
        this.text = options.text;
        this.endPoint = true;
        this.type = 'end_terminator';
    }
});

Workflow.Data = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'use_case';
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x +20;
        var y = this.y;
        var xw = this.x + this.width;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(x, y);

        ctx.lineTo(xw, y);
        ctx.lineTo(xw - 20, yh);
        ctx.lineTo(x - 20, yh);
        ctx.lineTo(x, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym){
        var a = this.width/2;
        var b = this.height/2;
        var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

        return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
    }
});

Workflow.Decision = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'use_case';
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        var x = this.x;
        var y = this.y;
        var xm = this.x + this.width/2;
        var ym = this.y + this.height/2;
        var xw = this.x + this.width;
        var yh = this.y + this.height;

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(xm, y);

        ctx.lineTo(xw, ym);
        ctx.lineTo(xm, yh);
        ctx.lineTo(x, ym);
        ctx.lineTo(xm, y);

        ctx.stroke();
        ctx.fillStyle = "#fcf5d9";
        ctx.fill();
        ctx.fillStyle = "#000000";

        this._drawText(ctx, this._splitText(ctx, this.text));
    },
    _splitText: function(ctx, text){
        var words = text.split(' ');
        var buff = '';
        var lines = [];

        for (var i = 0; i < words.length; i++) {
            if (ctx.measureText(buff + words[i]).width > this.width -10){
                lines.push(buff);
                buff = words[i] + ' ';
            }else{
                buff = buff + ' ' + words[i];
            }
        }
        lines.push(buff);

        return lines;
    },
    _drawText : function(ctx, lines, horiAlign, vertAlign){
        var x = this.x,
            y = this.y,
            xm = this.x + this.width / 2,
            ym = this.y + this.height / 2;
        if (typeof lines === 'string'){
            var tmp = lines;
            lines = [tmp];
        }

        y = ym + 3 - ((6*lines.length + 3*lines.length) / 2);

        for (var i = 0; i < lines.length; i++){
            var textW = ctx.measureText(lines[i]).width;
            ctx.fillText(lines[i], xm - textW/2, y+3);
            y = y + Loira.Config.fontSize + 3;
        }
    },
    /**
     * Obtiene la posicion del borde del simbolo interesectado por un relacion (linea)
     *
     * @param xm Delta x de la relacion
     * @param ym Delta y de la relacion
     * @returns {number} Distancia borde del simbolo
     */
    obtainBorderPos : function(xm, ym){
        var a = this.width/2;
        var b = this.height/2;
        var ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

        return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
    }
});
