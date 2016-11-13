/**
 * Diagrama de Caso de uso
 *
 * @namespace
 */
module UseCase{
    import BaseOption = Loira.util.BaseOption;
    import RelOption = Loira.util.RelOption;
    /**
     * Simbolo de Caso de uso
     *
     * @class
     * @memberof UseCase
     * @augments Common.Symbol
     */
    export class UseCase extends Common.Symbol {
        constructor(options: BaseOption) {
            super(options);

            this.width = 100;
            this.height = 70;
            this.text = options.text;
            this.type = 'use_case';
        }

        obtainBorderPos(xm: number, ym: number, points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            let a = this.width/2;
            let b = this.height/2;
            let ee = a*b / Math.sqrt(a*a*ym*ym + b*b*xm*xm);

            return Math.sqrt(Math.pow(ee*ym, 2) + Math.pow(ee*xm, 2));
        }

        _render(ctx: CanvasRenderingContext2D): void {
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            if (this.text) {
                var kappa = .5522848,
                    ox = (this.width / 2) * kappa,
                    oy = (this.height / 2) * kappa,
                    xe = this.x + this.width,
                    ye = this.y + this.height,
                    xm = this.x + this.width / 2,
                    ym = this.y + this.height / 2;

                ctx.beginPath();
                ctx.lineWidth = 2;

                ctx.moveTo(this.x, ym);
                ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
                ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
                ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
                ctx.stroke();
                ctx.fillStyle = "#fcf5d9";
                ctx.fill();
                ctx.fillStyle = "#000000";

                this._drawText(ctx, this._splitText(ctx, this.text));
            }
        }

        recalculateBorders() {
        }

        private _splitText(ctx: CanvasRenderingContext2D, text: string) {
            var words = text.split(' ');
            var buff = '';
            var lines = [];

            for (var i = 0; i < words.length; i++) {
                if (ctx.measureText(buff + words[i]).width > this.width - 10) {
                    lines.push(buff);
                    buff = words[i] + ' ';
                } else {
                    buff = buff + ' ' + words[i];
                }
            }
            lines.push(buff);

            return lines;
        }

        private _drawText(ctx: CanvasRenderingContext2D, lines: any, horiAlign?: boolean, vertAlign?: boolean) {
            let y,
                xm = this.x + this.width / 2,
                ym = this.y + this.height / 2;
            if (typeof lines === 'string') {
                lines = [lines];
            }

            y = ym + 3 - ((6 * lines.length + 3 * lines.length) / 2);

            for (var i = 0; i < lines.length; i++) {
                var textW = ctx.measureText(lines[i]).width;
                ctx.fillText(lines[i], xm - textW / 2, y + 3);
                y = y + Loira.Config.fontSize + 3;
            }
        }
    }

    /**
     * Contiene las funciones para relacion de extension
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    export class Extends extends Common.Relation{
        constructor(options: RelOption){
            options.icon = 'spear1.png';
            options.text = '<< extends >>';
            options.isDashed = true;

            super(options);
            this.type = 'extends';
        }
    }

    /**
     * Contiene las funciones para relacion de inclusion
     *
     * @class
     * @memberof UseCase
     * @augments Common.Relation
     */
    export class Include extends Common.Relation{
        constructor(options: RelOption){
            options.icon = 'spear1.png';
            options.text = '<< include >>';
            options.isDashed = true;

            super(options);
            this.type = 'include';
        }
    }
}

