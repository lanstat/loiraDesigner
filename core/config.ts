module Loira{
    import Region = Loira.util.Region;

    var _fontSize:number = 12;

    var _fontType:string = 'Arial';

    var _selected:any = {
        color: '#339966'
    };

    var _background:string = '#aacccc';

    var _assetsPath:string = '../assets/glyphs.png';

    var _regions: {[id: string] : Region} = {
        'actor': {x: 0, y: 98, width: 35, height: 72},
        'spear': {x: 0, y: 0, width: 25, height: 25},
        'spear1': {x: 0, y: 31, width: 27, height: 28},
        'spear2': {x: 34, y: 0, width: 25, height: 26},
        'arrow': {x: 27, y: 26, width: 12, height: 16}
    };

    export module Config{
        export var fontSize = _fontSize;
        export var fontType = _fontType;
        export var selected = _selected;
        export var background = _background;
        export var assetsPath = _assetsPath;
        export var regions = _regions;
    }
}
