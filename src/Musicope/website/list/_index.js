define(["require", "exports", "./controllers/_load"], function(require, exports, __controllers__) {
    /// <reference path="_references.ts" />
    var controllers = __controllers__;

    ko.applyBindings(new controllers.Basic());
})
//@ sourceMappingURL=_index.js.map
