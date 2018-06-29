module Loira{
    import Key = Loira.util.Key;

    export class Keyboard{
        public lastKey: number;

        /**
         * Class's constructor
         * @param canvas Canvas selected
         */
        constructor(private canvas: Canvas){}

        bind(){
            let _this = this;
            let element = this.canvas._canvas;

            element.onkeydown = function(evt){
                _this.onKeyDownPrivate(evt);
            };

            document.addEventListener('keydown', function(evt){
                _this.onKeyDownGlobal(evt);
            });

            element.onkeyup = function(evt){
                _this.onKeyUp(evt);
            };

            document.addEventListener('keyup', function(evt){
                _this.onKeyUp(evt);
            });
        }

        private onKeyDown(evt, isGlobal){
            if (evt.keyCode === Key.ALT){return;}

            this.lastKey = evt.keyCode;

            if (!isGlobal){
                if (this.lastKey === Key.DELETE) {
                    if (this.canvas.readOnly){return;}
                    this.canvas.removeSelected(false);
                }
            }
        };

        private onKeyDownPrivate = function (evt) {
            this.onKeyDown(evt, false);
        };

        private onKeyDownGlobal = function (evt) {
            this.onKeyDown(evt, true);
        };

        private onKeyUp = function(evt){
            if (this.canvas.readOnly){return;}
            this.LastKey = null;
        };
    }
}