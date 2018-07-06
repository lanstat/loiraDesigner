module OrgChart{
    import BaseController = Loira.BaseController;
    import RelOption = Loira.util.RelOption;
    import Point = Loira.util.Point;
    import fontSize = Loira.Config.fontSize;
    import Rect = Loira.util.Rect;
    import Common = Loira.Common;

    let levelColor: string[] = ['#124FFD', '#FF4FFD', '#12003D'];
    let levelHeight: number[];

    export class RoleOption extends Loira.util.BaseOption{
        id: string;
        parent: OrgChart.Role;
        name: string;
        title: string;
        personName: string;
        isDuplicate: boolean;
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
            if (!this.role.isDuplicate){
                this.role.color = levelColor[level];
            }
            this.role.level = level;

            if (levelHeight[level] < this.role.height){
                levelHeight[level] = this.role.height;
            }
        }

        getAllChildren(): Group[] {
            let children: Group[] = [];

            if (this.children.length > 0) {
                for (let i: number = 0; i < this.children.length; i++){
                    let records: Group[] = this.children[i].getAllChildren();
                    children.push(this.children[i]);
                    for (let j: number =0;j < records.length; j++){
                        children.push(records[j]);
                    }
                }
            }

            return children;
        }

        getAllParent(): Group[] {
            let parent: Group[] = [];
            let gr: Group = this;

            while (gr.parent){
                parent.push(gr.parent);
                gr = gr.parent;
            }

            return parent;
        }
    }

    /**
     * Controller that manage the events for the organization chart
     */
    export class Controller extends BaseController{
        private roots: Group[] = [];
        public elements: Group[] = [];
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

            canvas.on('relation:pre-add', function(evt: Loira.event.RelationEvent){
                let relations: Common.Relation[] = canvas.getRelationsFromObject(evt.selected.start, false, true);

                for (let relation of relations){
                    if (relation.end == evt.selected.end){
                        return false;
                    }
                }

                let child = $this.getGroup(<Role>evt.selected.end, $this.elements).item;
                if (child){
                    let listChild: Group[] = child.getAllChildren();
                    listChild.push(child);
                    for (let i: number = 0; i<listChild.length;i++){
                        if (listChild[i].role.id === (<Role>evt.selected.start).id && listChild[i].role != evt.selected.start){
                            return false;
                        }
                    }
                }
            });

            canvas.on('object:selected', function(evt: Loira.event.ObjectEvent){
                let role: Role = <Role>evt.selected;

                if (role.isDuplicate){
                    canvas.centerToPoint(role.rolePrimary.x, role.rolePrimary.y);
                    canvas.setSelectedElement(role.rolePrimary);
                    setTimeout(function () {
                        canvas.trigger('object:selected', role.rolePrimary);
                    }, 300);
                }
            });

            canvas.on('relation:added', function(evt: Loira.event.RelationEvent){
                let index: number = $this.getGroup(<Role>evt.selected.end, $this.roots).index;

                let child = $this.getGroup(<Role>evt.selected.end, $this.elements).item;
                let item = $this.getGroup(<Role>evt.selected.start, $this.elements).item;

                if (index>=0) {
                    $this.roots.splice(index, 1);
                    if (item.parent == child){ //If new parent was a child from the new child
                        $this.roots.push(item);
                    }
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

                if (item.parent == child){
                    item.parent = child.parent;
                    index = $this.getGroup(item.role, child.children).index;
                    child.children.splice(index, 1);

                    if (item.parent){
                        item.parent.children.push(item);
                        let option = new RelOption();
                        option.start = item.parent.role;
                        option.end = item.role;
                        let relation = new OrgChart.Relation(option);
                        canvas.add([relation], false);
                    }
                    canvas.removeRelation(child.role, item.role);
                }

                child.parent = item;
                item.children.push(child);

                if ($this.autoRefresh){
                    $this.reorderElements();
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
                    let children = group.getAllChildren();
                    let roles: Role[] = [];
                    let toDelete: number[] = [];

                    for (let i = 0; i< children.length; i++){
                        toDelete.push($this.elements.indexOf(children[i]));
                        roles.push(children[i].role);
                    }

                    Loira.util.removeWhole(toDelete, $this.elements);
                    canvas.remove(roles, false);
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

        load(data: any){
            let option: RoleOption;
            let group: Group;
            let optionRel: RelOption;
            let elements: Role[] = [];
            let relations: Relation[] = [];
            let readOnly: boolean = this.canvas.readOnly;

            this.canvas.readOnly = false;

            for(let record of data){
                option = new RoleOption();
                option.id = record.id? record.id.toString(): '';
                option.personName = record.personName? record.personName.toString(): null;
                option.title = record.title? record.title.toString() : null;

                if (this.getGroupById(option.id).item){
                    option.isDuplicate = true;
                }

                group = new Group(new Role(option));

                if (readOnly){
                    group.role.on(null);
                }

                if (record.parent){
                    let parent = this.getGroupById(record.parent?record.parent.toString():'').item;
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

            this.canvas.readOnly = readOnly;
        }

        exportData(): {id: string, parent: string, level: number}[]{
            let data: {id: string, parent: string, level: number}[]= [];

            for (let element of this.elements){
                let parent = element.parent;
                data.push({id: element.role.id, level: element.role.level, parent: (parent? parent.role.id : null)});
            }
            return data;
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
         * @returns {{item: Group, index: number}}
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
            id = id.trim();

            for(let i=0;i<groups.length;i++){
                if (id !== '' && groups[i].role.id == id){
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
        public personName: string;
        public level: number;
        public id: string;
        public isDuplicate: boolean;
        public rolePrimary: OrgChart.Role;

        constructor(options: RoleOption){
            super(options);

            this.width = Loira.Config.orgChart.roleWidth;
            this.height = 20;

            this.parent = options.parent;
            this.title = options.title;
            this.resizable = false;
            this.draggable = false;
            this.id = options.id;
            this.personName = options.personName? options.personName : '';
            this.isDuplicate = options.isDuplicate? options.isDuplicate : false;

            this.type = 'role';
        }

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void {
            super.render(ctx, vX, vY);
            let pX: number = this.x - vX,
                pY: number = this.y - vY;

            let y,
                xm = pX + this.width / 2,
                height: number = 0;
            let personData,
                titleData;

            if (this.personName){
                personData = {
                    fontSize: Loira.Config.fontSize,
                    lines: super.splitText(ctx, this.personName)
                };

                height = (personData.fontSize + 3) * personData.lines.length + 5;
            }

            if (this.title){
                titleData = {
                    fontSize: Loira.Config.fontSize - (personData? 3: 0),
                    lines: super.splitText(ctx, this.title)
                };

                height += (titleData.fontSize + 3) * titleData.lines.length + 5;
            }

            y = pY + Loira.Config.fontSize;

            this.height = height;

            let radius = 5;
            let shadowColor: string;
            let shadowBlur: number;

            ctx.fillStyle = this.isDuplicate? '#000000' : this.color;
            ctx.lineWidth= 4;

            if (!this.isSelected){
                shadowColor = '#000000';
                shadowBlur=10;
                ctx.strokeStyle = '#000000';
            } else {
                shadowColor = '#00c0ff';
                shadowBlur=20;
                ctx.strokeStyle = '#00c0ff';
                this.isSelected = false;
            }

            // Blocked to Firefox because performance leaks
            if (this._canvas.userAgent != Loira.UserAgent.FIREFOX){
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur;
            }

            Loira.shape.drawRoundRect(ctx, pX, pY, this.width, this.height, radius);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = Loira.Config.fontSize + "px " + Loira.Config.fontType;

            if (personData){
                for (let i:number = 0; i < personData.lines.length; i++) {
                    let textW: number = ctx.measureText(personData.lines[i]).width;
                    ctx.fillText(personData.lines[i], xm - textW / 2, y + 3);
                    y = y + titleData.fontSize + 3;
                }
                y += 5;
                ctx.font = 'bold ' + titleData.fontSize + 'px ' + Loira.Config.fontType;
            }

            if (titleData){
                for (let i:number = 0; i < titleData.lines.length; i++) {
                    let textW: number = ctx.measureText(titleData.lines[i]).width;
                    ctx.fillText(titleData.lines[i], xm - textW / 2, y + 3);
                    y = y + titleData.fontSize + 3;
                }
            }
        }

        recalculateBorders() {
        }

        obtainBorderPos(points: Loira.util.Line, ctx: CanvasRenderingContext2D): number {
            return 0;
        }

        drawSelected(ctx: CanvasRenderingContext2D) {
            this.isSelected = true;
            this.render(ctx, this._canvas.virtualCanvas.x, this._canvas.virtualCanvas.y);
        }

        attach(canvas: Loira.Canvas): void {
            super.attach(canvas);
            let ctx = canvas.getContext();
            let height: number = 0;

            if (this.personName){
                height += (Loira.Config.fontSize + 3) * super.splitText(ctx, this.personName).length + 5;
            }

            if (this.title){
                height += (Loira.Config.fontSize + 3 - (this.personName? 3 : 0)) * super.splitText(ctx, this.title).length + 5;
            }

            this.height = height;

            if (canvas.readOnly){
                this.on(null);
            }

            if (this.isDuplicate) {
                this.setDuplicate();
            }
        }

        setDuplicate(): void{
            let elements = (<Controller>this._canvas.controller).elements;
            let cursor: Group = (<Controller>this._canvas.controller).getGroup(this).item;
            let listing: Group[] = cursor.getAllParent();
            let passed: boolean = true;

            for (let i: number=0; i<listing.length; i++){
                if (this.id && listing[i].role.id === this.id){
                    this.title = ' ';
                    this.id = '';
                    passed = false;
                    break;
                }
            }

            if (passed){
                for (let i: number=0; i < elements.length; i++){
                    if (elements[i].role !== this && elements[i].role.id == this.id.trim() && !elements[i].role.isDuplicate){
                        this.isDuplicate = true;
                        this.on(null);
                        this.rolePrimary = elements[i].role;
                        break;
                    }
                }
            }
        }

        update(data: {title: string, id: string}): void{
            this.title = data.title;
            this.id = data.id.trim();
            this.setDuplicate();
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

        render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void{
            let start:Rect = new Rect(this.start.x - vX, this.start.y - vY, this.start.width, this.start.height),
                end:Rect = new Rect(this.end.x - vX, this.end.y - vY, this.end.width, this.end.height),
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
