/// <reference path="../../src/definitions/JQuery.d.ts" />
/// <reference path="../../src/definitions/dustjs-linkedin.d.ts" />
/// <reference path="../../bower_components/videojs-plugin-components/vjsplugincomponents.d.ts" />
/// <reference path="../../src/definitions/VideoJS.d.ts" />
declare module Overlay {
    class Plugin {
        public _player: VjsPluginComponents.IPlayer;
        constructor(player);
        public enable(videoOverlays: VjsPluginComponents.IOverlaySpecification[], playerOverlays?: VjsPluginComponents.IOverlaySpecification[]): void;
    }
}
