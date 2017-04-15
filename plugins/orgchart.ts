module OrgChart{
    class RoleOption extends Loira.util.BaseOption{
        id: string;
        parent: OrgChart.Role;
        name: string;
        title: string;
        chart: Root;
    }

    export class Root{
        constructor(){

        }
    }

    /**
     * Class for organization chart
     *
     * @memberof OrgChart
     * @class Role
     * @augments Loira.Element
     */
    export class Role extends Common.Symbol{
        public color: string;
        public level: number;
        public parent: OrgChart.Role;
        public title: string;
        public chart: Root;
        private titleSize: number;

        constructor(options: RoleOption){
            super(options);

            this.width = 30;
            this.height = 20;

            this.parent = options.parent;
            this.title = options.title;
            this.chart = options.chart;

            this.type = 'role';

            this.recalculateLevel();
        }

        render(ctx: CanvasRenderingContext2D): void {
            super.render(ctx);

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        recalculateBorders() {
        }

        obtainBorderPos(xm: number, ym: number, points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            return 0;
        }

        recalculateLevel() {
            if (this.parent){

            } else {
                this.level = 0;
                this.color = Loira.Config.orgChart.levelColor[0];
            }
        }

        attach(canvas: Loira.Canvas): void {
            super.attach(canvas);
            let ctx: CanvasRenderingContext2D = canvas.getContext();

            this.titleSize = ctx.measureText(this.title).width;
        }
    }
}
