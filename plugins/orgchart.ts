module OrgChart{
    import BaseController = Loira.BaseController;
    import RelOption = Loira.util.RelOption;
    import Point = Loira.util.Point;

    let levelColor: string[] = ['#124FFD', '#FF4FFD', '#12003D'];
    let levelHeight: number[];

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
        level: number;

        constructor(role: Role){
            this.role = role;
            this.height = 40;
        }

        recalculate(level: number = 0) {
            this.width = 0;
            this.level = level;
            let nextLevel: number = level + 1;

            if (levelHeight.length <= level){
                levelHeight.push(this.role.height);
            }

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
            this.role.color = levelColor[level];

            if (levelHeight[level] < this.role.height){
                levelHeight[level] = this.role.height;
            }
        }
    }

    export class Controller extends BaseController{
        private roots: Group[] = [];
        private elements: Group[] = [];

        constructor(colors?: string[]){
            super();
            if (colors){
                levelColor = colors;
            }
        }

        bind(canvas: Loira.Canvas) {
            let $this = this;

            canvas.defaultRelation = 'OrgChart.Relation';

            canvas.on('object:added', function(evt: Loira.event.ObjectEvent){
                let group: Group = new Group(<Role>evt.selected);

                $this.roots.push(group);
                $this.elements.push(group);
                $this.reorderElements();
            });

            canvas.on('relation:added', function(evt: Loira.event.RelationEvent){
                let index: number = Controller.getGroup(<Role>evt.selected.end, $this.roots).index;

                let child = Controller.getGroup(<Role>evt.selected.end, $this.elements).item;
                let item = Controller.getGroup(<Role>evt.selected.start, $this.elements).item;

                if (index>=0) {
                    $this.roots.splice(index, 1);
                } else {
                    let children: Group[] = child.parent.children;
                    index = Controller.getGroup(child.role, children).index;
                    children.splice(index, 1);
                }

                child.parent = item;
                item.children.push(child);

                $this.reorderElements();
            });
        }

        reorderElements() {
            let x: number = 0;
            levelHeight = [];

            for(let root of this.roots){
                root.x = x;
                root.recalculate();
                x += root.width;
            }

            levelHeight[0] += 30;
            for(let i:number = 1; i<levelHeight.length; i++){
                levelHeight[i] += levelHeight[i-1] + 30;
            }

            for (let i:number = 0; i<this.elements.length; i++){
                let group: Group = this.elements[i];
                group.role.y = (group.level == 0)? 10 : levelHeight[group.level -1];
            }

            console.log(levelHeight);
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
        public parent: OrgChart.Role;
        public title: string;

        constructor(options: RoleOption){
            super(options);

            this.width = 150;
            this.height = 20;

            this.parent = options.parent;
            this.title = options.title;

            this.type = 'role';
        }

        render(ctx: CanvasRenderingContext2D): void {
            super.render(ctx);
            let y,
                xm = this.x + this.width / 2,
                lines: string[] = super.splitText(ctx, this.title);

            y = this.y + Loira.Config.fontSize;
            this.height = (Loira.Config.fontSize + 3) * lines.length + 5;

            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;
            ctx.fillStyle = "#FFFFFF";

            for (let i:number = 0; i < lines.length; i++) {
                let textW: number = ctx.measureText(lines[i]).width;
                ctx.fillText(lines[i], xm - textW / 2, y + 3);
                y = y + Loira.Config.fontSize + 3;
            }
        }

        recalculateBorders() {
        }

        obtainBorderPos(xm: number, ym: number, points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            return 0;
        }

        attach(canvas: Loira.Canvas): void {
            super.attach(canvas);
            let ctx = canvas.getContext();
            this.height = (Loira.Config.fontSize + 3) * super.splitText(ctx, this.title).length + 5;
        }
    }

    export class Relation extends Common.Relation {
        constructor(options: RelOption){
            super(options);
            this.type = 'orgchart:relation';
        }

        render(ctx: CanvasRenderingContext2D): void{
            let start:Role = <Role>this.start,
                end:Role = <Role>this.end,
                middleLine: number,
                init: Point;

            middleLine = end.y - 10;

            init = {x: start.x + start.width/2, y: start.y + start.height/2};

            this.points[0] = init;
            this.points[1] = {x: init.x, y: middleLine};
            this.points[2] = {x: end.x + end.width/2, y: middleLine};
            this.points[3] = {x: end.x + end.width/2, y: end.y + end.height/2}

            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.moveTo(init.x, init.y);
            ctx.lineJoin = 'round';

            for (let i:number = 1; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
        }
    }
}
