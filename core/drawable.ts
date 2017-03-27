/**
 * Created by juan.garson on 27/03/2017.
 */
module Loira{
    import Region = Loira.util.Region;

    export class Drawable{
        private image:HTMLImageElement;

        private regions:{[id: string]: Region};

        constructor(path: string, regions:{[id: string] : Region}, callback?:() => {}){
            this.image = new Image();
            this.image.src = path;
            this.image.onload = function () {
                callback();
            };

            this.regions = regions;
        }

        render(id: string, canvas: CanvasRenderingContext2D, x: number, y: number): void{
            let region:Region = this.regions[id];
            canvas.drawImage(this.image, region.x, region.y, region.width, region.height, x, y, region.width, region.height);
        }
    }
}