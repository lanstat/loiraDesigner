module Loira{
    var _fontSize:number = 12;

    var _fontType:string = 'Arial';

    var _selected:any = {
        color: '#339966'
    };

    var _background:string = '#aacccc';

    var _assetsPath:string = '../assets/';

    export module Config{
        export var fontSize = _fontSize;
        export var fontType = _fontType;
        export var selected = _selected;
        export var background = _background;
        export var assetsPath = _assetsPath;
    }
}
