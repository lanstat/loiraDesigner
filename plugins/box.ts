module Box{
    class ColorOption extends Loira.util.BaseOption{
        color: string
    }

    /**
     * Class for color square
     *
     * @memberof Box
     * @class Box
     * @augments Loira.Object
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

        _render(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "#000000";
        }

        recalculateBorders() {
        }
    }
}