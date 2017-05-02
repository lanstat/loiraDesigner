module OrgChart{
    import BaseController = Loira.BaseController;
    import RelOption = Loira.util.RelOption;
    import Point = Loira.util.Point;

    let levelColor: string[] = ['#124FFD', '#FF4FFD', '#12003D'];
    let levelHeight: number[];

    export class RoleOption extends Loira.util.BaseOption{
        id: string;
        parent: OrgChart.Role;
        name: string;
        title: string;
    }

    export class Group {
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

            if (this.width === 0){
                this.width = this.role.width + 10;
            }

            this.role.x = Math.floor(this.width/2 - this.role.width/2) + this.x;
            this.role.color = levelColor[level];
            this.role.level = level;

            if (levelHeight[level] < this.role.height){
                levelHeight[level] = this.role.height;
            }
        }

        getAllChildren(): Role[] {
            let children: Role[] = [];

            if (this.children.length > 0) {
                for (let i: number = 0; i < this.children.length; i++){
                    let records: Role[] = this.children[i].getAllChildren();
                    children.push(this.children[i].role);
                    for (let j: number =0;j < records.length; j++){
                        children.push(records[j]);
                    }
                }
            }

            return children;
        }
    }

    export class Controller extends BaseController{
        private roots: Group[] = [];
        private elements: Group[] = [];
        private autoRefresh: boolean;
        private canvas: Loira.Canvas;

        constructor(colors: string[] = null, autoRefresh: boolean = true){
            super();
            if (colors){
                levelColor = colors;
            }

            this.autoRefresh = autoRefresh;
        }

        bind(canvas: Loira.Canvas) {
            let $this = this;

            this.canvas = canvas;
            canvas.defaultRelation = 'OrgChart.Relation';

            canvas.on('object:added', function(evt: Loira.event.ObjectEvent){
                let group: Group = new Group(<Role>evt.selected);

                $this.roots.push(group);
                $this.elements.push(group);

                if ($this.autoRefresh){
                    $this.reorderElements();
                }
            });

            canvas.on('relation:added', function(evt: Loira.event.RelationEvent){
                let index: number = $this.getGroup(<Role>evt.selected.end, $this.roots).index;

                let child = $this.getGroup(<Role>evt.selected.end, $this.elements).item;
                let item = $this.getGroup(<Role>evt.selected.start, $this.elements).item;

                if (index>=0) {
                    $this.roots.splice(index, 1);
                } else {
                    let children: Group[] = child.parent.children;
                    index = $this.getGroup(child.role, children).index;
                    children.splice(index, 1);

                    let relations: Common.Relation[] = canvas.getRelationsFromObject(evt.selected.end, true, false);
                    let toDelete: Common.Relation[] = [];

                    for (let relation of relations){
                        if (relation.start != item.role){
                            toDelete.push(relation);
                        }
                    }

                    if (toDelete.length > 0){
                        canvas.remove(toDelete, false);
                    }
                }

                child.parent = item;
                item.children.push(child);

                if ($this.autoRefresh){
                    $this.reorderElements();
                    canvas.renderAll(true);
                }
            });

            canvas.on('object:removed', function(evt: Loira.event.ObjectEvent){
                let relation: Common.Relation;
                let group: Group;
                let index: number;

                if (evt.selected.baseType === 'relation'){
                    relation = <Common.Relation> evt.selected;
                    group = $this.getGroup(<Role>relation.end, $this.elements).item;
                } else {
                    index =  $this.getGroup(<Role>evt.selected, $this.elements).index;
                    group = $this.elements[index];
                    $this.elements.splice(index, 1);
                    canvas.remove(group.getAllChildren(), false);
                }

                if (group.parent){
                    index = $this.getGroup(group.role, group.parent.children).index;
                    group.parent.children.splice(index, 1);
                } else {
                    index = $this.getGroup(group.role, $this.roots).index;
                    $this.roots.splice(index, 1);
                }

                if (relation){
                    group.parent = null;
                    $this.roots.push(group);
                }

                if ($this.autoRefresh){
                    $this.reorderElements();
                }
            });
        }

        //TODO verificar porque al borrar falla el borrado en cascada
        load(data: any){
            let option: RoleOption;
            let group: Group;
            let optionRel: RelOption;
            let elements: Role[] = [];
            let relations: Relation[] = [];

            for(let record of data){
                option = new RoleOption();
                option.id = <string>record.id;
                option.title = <string>record.title;
                group = new Group(new Role(option));

                if (record.parent || record.parent !== 0){
                    let parent = this.getGroupById(record.parent).item;
                    parent.children.push(group);
                    group.parent = parent;

                    optionRel = new RelOption();
                    optionRel.start = parent.role;
                    optionRel.end = group.role;

                    relations.push(new Relation(optionRel));
                } else {
                    this.roots.push(group);
                }
                this.elements.push(group);
                elements.push(group.role);
            }

            this.canvas.add(elements, false);
            this.canvas.add(relations, false);
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
                group.role.y = (group.level === 0)? 10 : levelHeight[group.level -1];
            }
        }

        /**
         * Get a group by a role
         * @param role Role to search
         * @param groups List of groups to search
         * @returns {any}
         */
        getGroup(role: Role, groups?: Group[]): {item: Group, index: number}{
            if (!groups){
                groups = this.elements;
            }

            for(let i=0;i<groups.length;i++){
                if (groups[i].role == role){
                    return {item: groups[i], index: i};
                }
            }
            return {item: null, index: -1};
        }

        /**
         * Get a group by a role
         * @param id Role to search
         * @param groups List of groups to search
         * @returns {object}
         */
        getGroupById(id: string, groups?: Group[]): {item: Group, index: number}{
            if (!groups){
                groups = this.elements;
            }

            for(let i=0;i<groups.length;i++){
                if (groups[i].role.id == id){
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
        private isSelected: boolean;
        public level: number;
        public id: string;

        constructor(options: RoleOption){
            super(options);

            this.width = 150;
            this.height = 20;

            this.parent = options.parent;
            this.title = options.title;
            this.resizable = false;
            this.draggable = false;
            this.id = options.id;

            this.type = 'role';
        }

        render(ctx: CanvasRenderingContext2D): void {
            super.render(ctx);
            let y,
                xm = this.x + this.width / 2,
                lines: string[] = super.splitText(ctx, this.title);

            y = this.y + Loira.Config.fontSize;
            this.height = (Loira.Config.fontSize + 3) * lines.length + 5;

            let radius = 5;

            ctx.fillStyle = this.color;
            ctx.lineWidth= 4;
            ctx.shadowBlur=10;

            if (!this.isSelected){
                ctx.shadowColor = '#000000';
                ctx.strokeStyle = '#000000';
            } else {
                ctx.shadowColor = '#00c0ff';
                ctx.strokeStyle = '#00c0ff';
                ctx.shadowBlur=20;
                this.isSelected = false;
            }

            ctx.beginPath();
            ctx.moveTo(this.x + radius, this.y);
            ctx.lineTo(this.x + this.width - radius, this.y);
            ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
            ctx.lineTo(this.x + this.width, this.y + this.height - radius);
            ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
            ctx.lineTo(this.x + radius, this.y + this.height);
            ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
            ctx.lineTo(this.x, this.y + radius);
            ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

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

        drawSelected(ctx: CanvasRenderingContext2D) {
            this.isSelected = true;
            this.render(ctx);
        }

        attach(canvas: Loira.Canvas): void {
            super.attach(canvas);
            let ctx = canvas.getContext();
            this.height = (Loira.Config.fontSize + 3) * super.splitText(ctx, this.title).length + 5;
        }
    }

    /**
     * Class for relation between roles
     *
     * @memberof OrgChart
     * @class Relation
     * @augments Common.Relation
     */
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
            this.points[3] = {x: end.x + end.width/2, y: end.y + end.height/2};

            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.moveTo(init.x, init.y);
            ctx.lineJoin = 'round';

            for (let i:number = 1; i < this.points.length; i++){
                ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            ctx.stroke();
        }
    }
}
