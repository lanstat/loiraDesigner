/**
 * Diagrama de estados
 *
 * @namespace
 */
module Phase{
    import BaseOption = Loira.util.BaseOption;
    /**
     * Crea un nuevo Objeto de Estado
     *
     * @class
     * @memberof Phase
     */
    export class Phase extends Common.Symbol {
        constructor(options: BaseOption){
            super(options);
            this.width = 200;
            this.height = 100;
        }

        obtainBorderPos(xm: number, ym: number, points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            return undefined;
        }

        render(ctx: CanvasRenderingContext2D): void {
            let kappa = .5522848,
                ox = this.width * kappa,
                oy = this.height * kappa,
                xe = this.x + this.width,
                ye = this.y + this.height,
                xm = this.x + this.width/2,
                ym = this.y + this.height/2;

            ctx.beginPath();
            ctx.moveTo(this.x, ym);
            ctx.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
            ctx.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            ctx.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
            ctx.stroke();
            ctx.fillStyle = "#fcf5d9";
            ctx.fill();
        }

        recalculateBorders() {
        }
    }
}
