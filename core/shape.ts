module Loira.shape {
    import Point = Loira.util.Point;

    export enum HorizontalAlign {
        LEFT,
        CENTER,
        RIGHT
    }

    export enum VerticalAlign {
        TOP,
        MIDDLE,
        BOTTOM
    }

    export function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number){
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    export function drawText(ctx: CanvasRenderingContext2D, text: string, position: Point){

    }
}
