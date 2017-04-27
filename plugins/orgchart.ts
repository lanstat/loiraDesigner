module OrgChart{
    import BaseController = Loira.BaseController;
    class RoleOption extends Loira.util.BaseOption{
        id: string;
        parent: OrgChart.Role;
        name: string;
        title: string;
    }

    class Group {
        role: Role;
        parent: Group;
        children: Group[] = [];
        x: number;
        y: number;
        width: number;
        height: number;

        constructor(role: Role){
            this.role = role;
            this.height = 40;
        }

        recalculate(level: number = 0) {
            this.width = 0;
            let nextLevel: number = level + 1;

            for (let i=0; i<this.children.length;i++){
                let child:Group = this.children[i];
                child.x = this.x + this.width;
                child.recalculate(nextLevel);
                this.width += child.width;
            }

            if (this.width == 0){
                this.width = this.role.width + 10;
            }

            this.role.x = Math.floor(this.width/2 - this.role.width/2) + this.x;
            this.role.y = (level * (this.height + 10)) + 5;
            console.log(this.role.x, this.role.y);
        }
    }

    export class Controller
        extends BaseController{

        private roots: Group[] = [];
        private elements: Group[] = [];
        private canvas: Loira.Canvas;

        bind(canvas: Loira.Canvas) {
            let _this = this;
            this.canvas = canvas;

            canvas.on('object:added', function(evt: Loira.event.ObjectEvent){
                let group: Group = new Group(<Role>evt.selected);

                _this.roots.push(group);
                _this.elements.push(group);
                _this.reorderElements();
            });

            canvas.on('relation:added', function(evt: Loira.event.RelationEvent){
                let index: number = Controller.getGroup(<Role>evt.selected.end, _this.roots).index;

                let child = Controller.getGroup(<Role>evt.selected.end, _this.elements).item;
                let item = Controller.getGroup(<Role>evt.selected.start, _this.elements).item;

                if (index>=0) {
                    _this.roots.splice(index, 1);
                } else {
                    let children: Group[] = child.parent.children;
                    index = Controller.getGroup(child.role, children).index;
                    children.splice(index, 1);
                }

                child.parent = item;
                item.children.push(child);

                _this.reorderElements();
            })
        }

        reorderElements() {
            let x: number = 0;

            for(let root of this.roots){
                root.x = x;
                root.recalculate();
                x += root.width;
            }
        }

        private static getGroup(role: Role, groups: Group[]): {item: Group, index: number}{
            for(let i=0;i<groups.length;i++){
                if (groups[i].role == role){
                    return {item: groups[i], index: i};
                }
            }
            return {item: null, index: -1};
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
        private titleSize: number;

        constructor(options: RoleOption){
            super(options);

            this.width = 30;
            this.height = 20;

            this.parent = options.parent;
            this.title = options.title;

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
