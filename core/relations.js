var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Conjunto de relaciones comunes
 *
 * @namespace Relation
 * @license Apache-2.0
 */
var Relation;
(function (Relation) {
    /**
     * Contiene las funciones para relacion de asociacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Association = (function (_super) {
        __extends(Association, _super);
        function Association(options) {
            var _this = _super.call(this, options) || this;
            _this.type = 'association';
            return _this;
        }
        return Association;
    }(Common.Relation));
    Relation.Association = Association;
    /**
     * Contiene las funciones para relacion directa
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var DirectAssociation = (function (_super) {
        __extends(DirectAssociation, _super);
        function DirectAssociation(options) {
            var _this = this;
            options.icon = 'spear';
            _this = _super.call(this, options) || this;
            _this.type = 'direct_association';
            return _this;
        }
        return DirectAssociation;
    }(Common.Relation));
    Relation.DirectAssociation = DirectAssociation;
    /**
     * Contiene las funciones para relacion de generalizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Generalization = (function (_super) {
        __extends(Generalization, _super);
        function Generalization(options) {
            var _this = this;
            options.icon = 'spear2';
            _this = _super.call(this, options) || this;
            _this.type = 'generalization';
            return _this;
        }
        return Generalization;
    }(Common.Relation));
    Relation.Generalization = Generalization;
    /**
     * Contiene las funciones para relacion de realizacion
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Realization = (function (_super) {
        __extends(Realization, _super);
        function Realization(options) {
            var _this = this;
            options.icon = 'spear2';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'realization';
            return _this;
        }
        return Realization;
    }(Common.Relation));
    Relation.Realization = Realization;
    /**
     * Contiene las funciones para relacion de dependencia
     *
     * @class
     * @memberof Relation
     * @augments Common.Relation
     */
    var Dependency = (function (_super) {
        __extends(Dependency, _super);
        function Dependency(options) {
            var _this = this;
            options.icon = 'spear1';
            options.isDashed = true;
            _this = _super.call(this, options) || this;
            _this.type = 'dependency';
            return _this;
        }
        return Dependency;
    }(Common.Relation));
    Relation.Dependency = Dependency;
})(Relation || (Relation = {}));
//# sourceMappingURL=relations.js.map