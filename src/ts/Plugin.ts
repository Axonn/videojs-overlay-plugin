///<reference path='../definitions/JQuery.d.ts'/>
///<reference path='../definitions/dustjs-linkedin.d.ts'/>
///<reference path='../../bower_components/videojs-plugin-components/vjsplugincomponents.d.ts'/>
module Overlay {
    export class Plugin {
        _player: VjsPluginComponents.IPlayer;

        constructor(player) {
            this._player = new VjsPluginComponents.Player(player);
        }

        enable(videoOverlays: VjsPluginComponents.IOverlaySpecification[], playerOverlays?: VjsPluginComponents.IOverlaySpecification[]) {
            this._player.getVideo().overlays = videoOverlays;

            var applyServiceToPlayer = VjsPluginComponents.ApplySingleService(this._player);

            var durationEmitter = applyServiceToPlayer("DurationSetEmitter")(() => {
                return new VjsPluginComponents.DurationSetEmitter(this._player);
            });

            var singlePointEventRepository = applyServiceToPlayer("SinglePointEventRepository")(() => {
                return new VjsPluginComponents.SinglePointEventRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()));
            });

            var timeBasedEventRepository = applyServiceToPlayer("TimeBasedEventRepository")(() => {
                return new VjsPluginComponents.TimeBasedEventRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), singlePointEventRepository);
            });

            var layerRepository = applyServiceToPlayer("LayerRepository")(() => {
                return new VjsPluginComponents.LayerRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), dust, VjsPluginComponents.ContainerBuilder(this._player.el())("vjsOverlay"));
            });

            var playerOverlayRepository = applyServiceToPlayer("OverlayRepository")(() => {
                return new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableRepository(new VjsPluginComponents.Observable()), this._player, layerRepository, timeBasedEventRepository);
            });

            var eventManager = applyServiceToPlayer("TimeBasedEventManager")(() => {
                var singlePointEventList = new VjsPluginComponents.WalkableList(VjsPluginComponents.EventSortingFunction,
                    (a) => {
                        return (typeof a.maxCallCount === "undefined") || a.maxCallCount > a.callCount
                    },
                    singlePointEventRepository
                );

                return new VjsPluginComponents.TimeBasedEventManager(new VjsPluginComponents.PlayObserver(this._player), singlePointEventList, timeBasedEventRepository)
            });

            var videoOverlayRepository = new VjsPluginComponents.OverlayRepository(new VjsPluginComponents.ObservableSubRepository(playerOverlayRepository, new VjsPluginComponents.Observable()), this._player, layerRepository, timeBasedEventRepository);

            if (typeof (playerOverlays) !== "undefined") {
                for (var i = 0; i < playerOverlays.length; i++) {
                    videoOverlayRepository.createFromSpecification(playerOverlays[i]);
                }
            }

            var overlayManager = applyServiceToPlayer("OverlayManager")(() => {
                return new VjsPluginComponents.OverlayManager(this._player, videoOverlayRepository)
            });
        }
    }
}