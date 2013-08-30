///<reference path='../../../definitions/JQuery.d.ts'/>
///<reference path='../../../definitions/dustjs-linkedin.d.ts'/>
///<reference path='../vjsplugin/TimeBasedEventManager.ts'/>
///<reference path='../vjsplugin/PlayObserver.ts'/>
///<reference path='../vjsplugin/Player.ts'/>
///<reference path='../vjsplugin/DurationSetEmitter.ts'/>
///<reference path='../vjsplugin/ObservableRepository.ts'/>
///<reference path='../vjsplugin/WalkableList.ts'/>
///<reference path='../vjsplugin/EventSortingFunction.ts'/>
///<reference path='../vjsplugin/ITemplate.ts'/>
///<reference path='../vjsplugin/OverlayRepository.ts'/>
///<reference path='../vjsplugin/IOverlaySpecification.ts'/>
///<reference path='../vjsplugin/ContainerBuilder.ts'/>
///<reference path='../vjsplugin/LayerRepository.ts'/>
///<reference path='../vjsplugin/OverlayManager.ts'/>
///<reference path='../vjsplugin/SinglePointEventRepository.ts'/>
///<reference path='../vjsplugin/TimeBasedEventRepository.ts'/>
///<reference path='../vjsplugin/ApplySingleService.ts'/>
///<reference path='../vjsplugin/ObservableSubRepository.ts'/>

module Overlay {
    export class Plugin {
        _player: VjsPlugin.IPlayer;

        constructor(player) {
            this._player = new VjsPlugin.Player(player);
        }

        enable(overlays: VjsPlugin.IOverlaySpecification[]) {
            this._player.getVideo().overlays = overlays;

            var applyServiceToPlayer = VjsPlugin.ApplySingleService(this._player);

            var durationEmitter = applyServiceToPlayer("DurationSetEmitter")(() => {
                return new VjsPlugin.DurationSetEmitter(this._player);
            });

            var singlePointEventRepository = applyServiceToPlayer("SinglePointEventRepository")(() => {
                return new VjsPlugin.SinglePointEventRepository(new VjsPlugin.ObservableRepository(new VjsPlugin.Observable()));
            });

            var timeBasedEventRepository = applyServiceToPlayer("TimeBasedEventRepository")(() => {
                return new VjsPlugin.TimeBasedEventRepository(new VjsPlugin.ObservableRepository(new VjsPlugin.Observable()), singlePointEventRepository);
            });

            var layerRepository = applyServiceToPlayer("LayerRepository")(() => {
                return new VjsPlugin.LayerRepository(new VjsPlugin.ObservableRepository(new VjsPlugin.Observable()), dust, VjsPlugin.ContainerBuilder(this._player.el())("vjsOverlay"));
            });

            var playerOverlayRepository = applyServiceToPlayer("OverlayRepository")(() => {
                return new VjsPlugin.OverlayRepository(new VjsPlugin.ObservableRepository(new VjsPlugin.Observable()), this._player, layerRepository, timeBasedEventRepository);
            });

            var eventManager = applyServiceToPlayer("TimeBasedEventManager")(() => {
                var singlePointEventList = new VjsPlugin.WalkableList(VjsPlugin.EventSortingFunction,
                    (a) => {
                        return (typeof a.maxCallCount === "undefined") || a.maxCallCount > a.callCount
                    },
                    singlePointEventRepository
                );

                return new VjsPlugin.TimeBasedEventManager(new VjsPlugin.PlayObserver(this._player), singlePointEventList, timeBasedEventRepository)
            });

            var videoOverlayRepository = new VjsPlugin.OverlayRepository(new VjsPlugin.ObservableSubRepository(playerOverlayRepository, new VjsPlugin.Observable()), this._player, layerRepository, timeBasedEventRepository);

            var overlayManager = applyServiceToPlayer("OverlayManager")(() => {
                return new VjsPlugin.OverlayManager(this._player, videoOverlayRepository)
            });
        }
    }
}