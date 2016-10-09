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
 * @memberof UseCase
 * @augments Common.Symbol
 */
Workflow.Process = Loira.util.createClass(Common.Symbol, {
    initialize : function(options){
        this.callSuper('initialize', options);
        this.width = 100;
        this.height = 70;
        this.text = options.text;
        this.type = 'use_case';
    },
    _render: function(ctx) {
        ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

        ctx.beginPath();
        ctx.lineWidth = 2;

        //ctx.moveTo(this.x, this.y);
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

Workflow.Terminator = Loira.util.createClass(Common.Symbol, {
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
