module Box{
    export class ColorOption extends Loira.util.BaseOption{
        color: string
    }

    /**
     * Class for color square
     *
     * @memberof Box
     * @class Box
     * @augments Loira.Element
     */
    export class Box extends Loira.Element{
        public color: string;

        constructor(options: ColorOption){
            super(options);

            this.width = 'width' in options ? options.width : 30;
            this.height = 'height' in options ? options.height : 30;
            this.color =  'color' in options ? options.color: 'rgba(0,0,0,0.3)';

            this.baseType = 'box';
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            ctx.fillStyle = this.color;
            let x: number = this.x - vX,
                y: number = this.y - vY;

            ctx.fillRect(x, y, this.width, this.height);
            ctx.fillText(this.text, x, y -10)
        }

        recalculateBorders() {
        }
    }
}
