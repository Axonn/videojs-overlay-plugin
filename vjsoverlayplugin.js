var Overlay;
(function (Overlay) {
    var Plugin = (function () {
        function Plugin(player) {
            this._player = new VjsPluginComponents.Player(player);
        }
        Plugin.prototype.enable = function (overlays) {
            var _this = this;
            this._player.getVideo().overlays = overlays;

            var applyServiceToPlayer = VjsPluginComponents.ApplySingleService(this._player);

            var durationEmitter = applyServiceToPlayer("DurationSetEmitter")(function () {
                return new VjsPluginComponents.DurationSetEmitter(_this._player);
            });

            var singlePointEventRepository = applyServiceToPlayer("SinglePointEventRepository")(function () {
                return new VjsPluginComponents.SinglePointEventRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()));
            });

            var timeBasedEventRepository = applyServiceToPlayer("TimeBasedEventRepository")(function () {
                return new VjsPluginComponents.TimeBasedEventRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), singlePointEventRepository);
            });

            var layerRepository = applyServiceToPlayer("LayerRepository")(function () {
                return new VjsPluginComponents.LayerRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), dust, VjsPluginComponents.ContainerBuilder(_this._player.el())("vjsOverlay"));
            });

            var playerOverlayRepository = applyServiceToPlayer("OverlayRepository")(function () {
                return new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), _this._player, layerRepository, timeBasedEventRepository);
            });

            var eventManager = applyServiceToPlayer("TimeBasedEventManager")(function () {
                var singlePointEventList = new VjsPluginComponents.WalkableList(VjsPluginComponents.EventSortingFunction, function (a) {
                    return (typeof a.maxCallCount === "undefined") || a.maxCallCount > a.callCount;
                }, singlePointEventRepository);

                return new VjsPluginComponents.TimeBasedEventManager(new VjsPluginComponents.PlayObserver(_this._player), singlePointEventList, timeBasedEventRepository);
            });

            var videoOverlayRepository = new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableSubRepository(playerOverlayRepository, new VjsPluginComponents.Observable()), this._player, layerRepository, timeBasedEventRepository);

            var overlayManager = applyServiceToPlayer("OverlayManager")(function () {
                return new VjsPluginComponents.OverlayManager(_this._player, videoOverlayRepository);
            });
        };
        return Plugin;
    })();
    Overlay.Plugin = Plugin;
})(Overlay || (Overlay = {}));
_V_.plugin("overlayPlugin", function (options) {
    var plugin = new Overlay.Plugin(this);
    plugin.enable(options.overlays);
});
//# sourceMappingURL=file:////home/travis/build/Axonn/videojs-overlay-plugin/build/js/vjsoverlayplugin.js.map
