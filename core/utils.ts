/**
 * Clase base para la creacion de nuevos objetos dibujables
 *
 * @memberof Loira
 * @namespace util
 */
module Loira.util{
    import TypeLine = Common.TypeLine;
    export class BaseOption{
        x: number = 0;
        y: number = 0;
        width: number = 0;
        height: number = 0;
        centerObject: boolean = false;
        maxOutGoingRelation: number = 0;
        _canvas: Loira.Canvas;
        type: string;
        baseType: string;
        extras: any = {};
        text: string = '';
        selectable: boolean = true;
        resizable: boolean = true;
        draggable: boolean = true;
    }

    export class RelOption extends BaseOption{
        start: Common.Symbol;
        end: Common.Symbol;
        text: string;
        isDashed: boolean;
        points: Point[];
        icon: string;
        typeLine: TypeLine;
    }

    export class Line{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    export class Region{
        height: number;
        width: number;
        x: number;
        y: number;
    }

    export class Point{
        x: number;
        y: number;

        constructor(x?: number, y?: number){
            this.x = x;
            this.y = y;
        }
    }

    export class Rect{
        constructor(public x?: number, public y?: number, public width?: number, public height?: number){
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

        let fn:any = (window || this);
        for (let part of arr) {
            fn = fn[part];
        }

        if (typeof fn !== "function") {
            throw new Error("function not found");
        }

        return  fn;
    }

    export function removeWhole(indexes:number[], vector: any[]){
        indexes.sort(function (a, b) {
            return a - b;
        });

        for (let i=indexes.length -1; i >= 0; i--){
            vector.splice(indexes[i], 1);
        }
    }

    export function getIndex<T>(vector: T[], item: T): number{
        let response: number = -1;
        for(let i:number = 0; i< vector.length; i++){
            if (vector[i] == item){
                response = i;
                break;
            }
        }

        return response;
    }

    export function logger(logLevel: Loira.LogLevel, message?: string, data?: string){
        // let padStr = function(i){
        //     return (i < 10)? '0' + i : '' + i;
        // };

        if (Loira.Config.debug && logLevel <= Loira.Config.logLevel ){
            console.log('[Loira ' + new Date().getTime() + '] ' + message);
        }
    }
}