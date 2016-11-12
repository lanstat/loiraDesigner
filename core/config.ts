module Loira{
    var fontSize:number = 12;

    var fontType:string = 'Arial';

    var selected:any = {
        color: '#339966'
    };

    var background:string = '#aacccc';

    var assetsPath:string = '../assets/';

    export module Config{
        export var fontSize = fontSize;
        export var fontType = fontType;
        export var selected = selected;
        export var background = background;
        export var assetsPath = assetsPath;
    }
}
