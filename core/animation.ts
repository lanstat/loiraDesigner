module Loira {
    export class Animation{
        private _isRunning: boolean;
        private _fps: number;
        private _element: Loira.Element;
        private _registers: {stepX: number, stepY: number, type: number, times: number}[] = [];
    
        constructor(element: Loira.Element) {
            this._element = element;
        }
    
        moveTo(x: number, y: number, seconds: number = 1){
            let times: number = this._fps * seconds;
    
    
    
            this._isRunning = true;
        }
    
        setFps(fps: number) {
            this._fps = fps;
        }
    
        proccess(): void {
            if (this._isRunning){
                if (this._registers.length == 0){
                    this._isRunning = false;
                }
            }
        }
    }
}