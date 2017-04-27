var Loira;
(function (Loira) {
    var _fontSize = 12;
    var _fontType = 'Arial';
    var _selected = {
        color: '#339966'
    };
    var _background = '#aacccc';
    var _assetsPath = '../assets/glyphs.png';
    var _regions = {
        'actor': { x: 0, y: 98, width: 35, height: 72 },
        'spear': { x: 0, y: 0, width: 25, height: 25 },
        'spear1': { x: 0, y: 31, width: 27, height: 28 },
        'spear2': { x: 34, y: 0, width: 25, height: 26 },
        'arrow': { x: 27, y: 26, width: 12, height: 16 }
    };
    var Config;
    (function (Config) {
        Config.fontSize = _fontSize;
        Config.fontType = _fontType;
        Config.selected = _selected;
        Config.background = _background;
        Config.assetsPath = _assetsPath;
        Config.regions = _regions;
    })(Config = Loira.Config || (Loira.Config = {}));
})(Loira || (Loira = {}));
//# sourceMappingURL=config.js.map