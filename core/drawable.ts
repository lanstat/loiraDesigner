/**
 * Created by juan.garson on 27/03/2017.
 */
module Loira.drawable{
    import Region = Loira.util.Region;

    let regions:{[id: string]: Region};
    let image:HTMLImageElement;

    export function registerMap(path:string, regions:{[id: string] : Region}, callback?:() => void){
        this.image = new Image();
        this.image.src = path;
        this.image.onload = function () {
            callback();
        };

        this.regions = regions;
    }

    export function render(id: string, canvas: CanvasRenderingContext2D, x: number, y: number){
        let region:Region = this.regions[id];
        canvas.drawImage(this.image, region.x, region.y, region.width, region.height, x, y, region.width, region.height);
    }

    export function get(id: string): Region{
        return this.regions[id];
    }
}