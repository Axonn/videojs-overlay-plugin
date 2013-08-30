///<reference path='Plugin.ts'/>
///<reference path='../../../definitions/VideoJS.d.ts'/>

_V_.plugin("overlayPlugin", function (options) {
    var plugin = new Overlay.Plugin(this);
    plugin.enable(options.overlays);
});