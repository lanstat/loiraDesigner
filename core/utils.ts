/**
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @namespace util
 */
module Loira.util{
    export class BaseOption{
        x: number;
        y: number;
        width: number;
        height: number;
        centerObject: boolean;
        maxOutGoingRelation: number;
        _canvas: any;
        type: string;
        baseType: string;
        extras: any;
        text: string;
    }

    export class RelOption extends BaseOption{
        start: Common.Symbol;
        end: Common.Symbol;
        text: string;
        isDashed: boolean;
        points: Point[];
        icon: string;
    }

    export class Line{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    export class Point{
        x: number;
        y: number;

        constructor(x?: number, y?: number){
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Crea una cadena con caracteres aleatorios
     *
     * @param maxLength Longitud de la cadena
     * @returns {string}
     */
    export function createRandom(maxLength:number):string{
        let text:string = "";
        let possible:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( let i:number=0; i < maxLength; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    /**
     * Determina la el punto de intereseccion entre 2 lineas
     *
     * @param line1 Linea 1
     * @param line2 Linea 2
     * @returns {*}
     */
    export  function intersectPointLine(line1:Line, line2:Line):any{
        let den:number = ((line1.y2 - line1.y1) * (line2.x2 - line2.x1)) - ((line1.x2 - line1.x1) * (line2.y2 - line2.y1));
        if (den === 0) {
            return false;
        }
        let a:number = line2.y1 - line1.y1;
        let b:number = line2.x1 - line1.x1;
        let numerator1:number = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);

        a = numerator1 / den;

        return {x: line2.x1 + (a * (line2.x2 - line2.x1)), y: line2.y1 + (a * (line2.y2 - line2.y1))};
    }

    /**
     * Instancia una clase tomando una cadena como base
     *
     * @param str Nombre de la clase, o espacio de nombre a instanciar
     * @returns {*}
     */
    export function stringToFunction(str:string):any {
        let arr:string[] = str.split(".");

        var fn:any = (window || this);
        for (let part of arr) {
            fn = fn[part];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return  fn;
    }
}