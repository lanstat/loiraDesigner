var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            _super.call(this, options);
            this.type = 'association';
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
            options.icon = 'spear';
            _super.call(this, options);
            this.type = 'direct_association';
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
            options.icon = 'spear2';
            _super.call(this, options);
            this.type = 'generalization';
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
            options.icon = 'spear2';
            options.isDashed = true;
            _super.call(this, options);
            this.type = 'realization';
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
            options.icon = 'spear1';
            options.isDashed = true;
            _super.call(this, options);
            this.type = 'dependency';
        }
        return Dependency;
    }(Common.Relation));
    Relation.Dependency = Dependency;
})(Relation || (Relation = {}));
//# sourceMappingURL=relations.js.map