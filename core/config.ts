module Loira{
    import Region = Loira.util.Region;

    let _fontSize:number = 12;

    let _fontType:string = 'Arial';

    let _selected:any = {
        color: '#339966'
    };

    let _background:string = '#aacccc';

    let _assetsPath:string = '../assets/glyphs.png';

    let _regions: {[id: string] : Region} = {
        'actor': {x: 0, y: 98, width: 35, height: 72},
        'spear': {x: 0, y: 0, width: 15, height: 14},
        'spear1': {x: 0, y: 13, width: 14, height: 15},
        'spear2': {x: 34, y: 0, width: 25, height: 26},
        'arrow': {x: 27, y: 26, width: 12, height: 16}
    };

    let _scrollBar: any = {
        size: 10,
        color: 'rgba(255, 255, 255, 0.85)',
        background: 'rgba(0, 0, 0, 0.15)'
    };

    let _orgchart: any = {
        roleWidth: 150
    };

    export enum LogLevel {
        INFO = 99,
        SYSTEM = 2,
        WARNING = 1,
        DANGER = 0
    }

    export module Config{
        export let fontSize = _fontSize;
        export let fontType = _fontType;
        export let selected = _selected;
        export let background = _background;
        export let assetsPath = _assetsPath;
        export let regions = _regions;
        export let debug = false;
        export let logLevel = LogLevel.SYSTEM;
        export let scrollBar = _scrollBar;
        export let orgChart = _orgchart;
    }
}
