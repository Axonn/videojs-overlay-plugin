/// <reference path="../../../definitions/Jasmine.d.ts" />
/// <reference path="../../../definitions/JQuery.d.ts" />
/// <chutzpah_reference path="../../../lib/JQuery/jquery-1.9.1.js" />
/// <reference path="../../../local/plugins/vjsplugin/OverlayManager.ts" />
/// <reference path="../../../local/plugins/vjsplugin/IOverlay.ts" />
/// <reference path="../../../local/plugins/vjsplugin/IOverlays.ts" />
/// <reference path="../../../local/plugins/vjsplugin/Overlays.ts" />
/// <reference path="../../../local/plugins/vjsplugin/IOverlaySpecification.ts" />
/// <reference path="../../../local/plugins/vjsplugin/IPlayer.ts" />
/// <reference path="../../../local/plugins/vjsplugin/AddClassToElementAtTimes.ts" />
describe("overlay manager", function () {
    var eventManagerRegisterSpy = jasmine.createSpy('eventManager.register');
    var playerSpy = jasmine.createSpy('player');
    var renderSpy = jasmine.createSpy('renderEngine.render');
    var overlaySpy = jasmine.createSpy('overlaySpy');
    var playerOneSpy = jasmine.createSpy("player.one");
    var containerHtmlSpy = jasmine.createSpy("container.html");
    var outputSpy = jasmine.createSpy("output");
    var errorSpy = jasmine.createSpy('error');
    var container = {
        html: containerHtmlSpy
    };
    var createContainerSpy = jasmine.createSpy('containerBuilder').andReturn(container);
    var model = {
        property1: "hello",
        property2: 999
    };
    var model2 = {
        property1: "goodbye",
        property2: 777
    };
    var template = {
        name: "test"
    };
    var displayTimes = [
        {
            start: function (videoEnd) {
                return videoEnd;
            },
            end: function (videoEnd) {
                return videoEnd;
            },
            type: "switch"
        }
    ];
    var overlay = {
        displayTimes: displayTimes,
        template: template,
        model: model,
        events: {
        }
    };
    var overlay2 = {
        displayTimes: displayTimes,
        template: template,
        model: model2,
        events: {
        }
    };
    var eventManager = {
        triggerTimeBasedEvents: jasmine.createSpy('eventManager.trigger'),
        registerSingleEvent: jasmine.createSpy('eventManager.registerSingle'),
        registerTimeBasedEvent: eventManagerRegisterSpy
    };
    var renderEngine = {
        render: renderSpy
    };
    var player = {
        videos: jasmine.createSpy("player.videos"),
        toOriginal: jasmine.createSpy("player.toOriginal"),
        setVideo: jasmine.createSpy("player.setVideo"),
        getVideo: jasmine.createSpy("player.getVideo"),
        dispose: jasmine.createSpy("player.dispose"),
        createEl: jasmine.createSpy("player.createEl"),
        el: jasmine.createSpy("player.el"),
        addChild: jasmine.createSpy("player.addChild"),
        children: jasmine.createSpy("player.children"),
        on: jasmine.createSpy("player.on"),
        off: jasmine.createSpy("player.off"),
        one: playerOneSpy,
        trigger: jasmine.createSpy("player.trigger"),
        show: jasmine.createSpy("player.show"),
        hide: jasmine.createSpy("player.hide"),
        width: jasmine.createSpy("player.width"),
        height: jasmine.createSpy("player.height"),
        dimensions: jasmine.createSpy("player.dimensions"),
        currentTime: jasmine.createSpy("player.currentTime"),
        techName: jasmine.createSpy("player.techName"),
        play: jasmine.createSpy("player.play"),
        currentSrc: jasmine.createSpy("player.currentSrc"),
        options: jasmine.createSpy('player.options'),
        duration: jasmine.createSpy('player.duration').andReturn(300)
    };
    var overlayRepository = new Overlay.Overlays(player, renderEngine, createContainerSpy);
    var addClassToElementAtTimesFunc = VjsPlugin.AddClassToElementAtTimes(eventManager)("VjsVisible");
    it("correctly adds an overlay at videoEnd", function () {
        var sut = new Overlay.OverlayManager(addClassToElementAtTimesFunc, player, overlayRepository);
        sut.registerOverlay(overlay);
        for(var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if(playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }
        for(var i = 0; i < renderSpy.argsForCall.length; i++) {
            if(renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }
        expect(eventManagerRegisterSpy).toHaveBeenCalledWith(player.duration(), player.duration(), jasmine.any(Function), jasmine.any(Function));
        expect(renderSpy).toHaveBeenCalledWith(template.name, {
            model: model
        }, jasmine.any(Function));
        expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);
        expect(createContainerSpy).toHaveBeenCalledWith(0);
    });
    it("correctly adds two overlays at videoEnd", function () {
        var sut = new Overlay.OverlayManager(addClassToElementAtTimesFunc, player, overlayRepository);
        sut.registerOverlay(overlay);
        sut.registerOverlay(overlay2);
        for(var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if(playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }
        for(var i = 0; i < renderSpy.argsForCall.length; i++) {
            if(renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }
        expect(eventManagerRegisterSpy).toHaveBeenCalledWith(player.duration(), player.duration(), jasmine.any(Function), jasmine.any(Function));
        expect(renderSpy).toHaveBeenCalledWith(template.name, {
            model: model
        }, jasmine.any(Function));
        expect(renderSpy).toHaveBeenCalledWith(template.name, {
            model: model2
        }, jasmine.any(Function));
        expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);
        expect(createContainerSpy).toHaveBeenCalledWith(0);
        expect(createContainerSpy).toHaveBeenCalledWith(1);
    });
    it("correctly triggers onCreate function after create", function () {
        var sut = new Overlay.OverlayManager(addClassToElementAtTimesFunc, player, overlayRepository);
        var onCreateSpy = jasmine.createSpy('event.onCreate');
        var localOverlay = {
            displayTimes: displayTimes,
            template: template,
            model: model,
            events: {
                "onCreate": [
                    onCreateSpy
                ]
            }
        };
        sut.registerOverlay(localOverlay);
        for(var i = 0; i < playerOneSpy.argsForCall.length; i++) {
            if(playerOneSpy.argsForCall[i][0] == "durationset") {
                playerOneSpy.argsForCall[i][1]();
            }
        }
        for(var i = 0; i < renderSpy.argsForCall.length; i++) {
            if(renderSpy.argsForCall[i][0] == template.name) {
                renderSpy.argsForCall[i][2](errorSpy, outputSpy);
            }
        }
        expect(eventManagerRegisterSpy).toHaveBeenCalledWith(player.duration(), player.duration(), jasmine.any(Function), jasmine.any(Function));
        expect(renderSpy).toHaveBeenCalledWith(template.name, {
            model: model
        }, jasmine.any(Function));
        expect(renderSpy).toHaveBeenCalledWith(template.name, {
            model: model2
        }, jasmine.any(Function));
        expect(containerHtmlSpy).toHaveBeenCalledWith(outputSpy);
        expect(createContainerSpy).toHaveBeenCalledWith(0);
        expect(createContainerSpy).toHaveBeenCalledWith(1);
        expect(onCreateSpy).toHaveBeenCalledWith({
            overlay: jasmine.any(Object)
        });
    });
});
