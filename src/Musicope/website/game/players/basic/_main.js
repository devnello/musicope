define(["require", "exports", "./playNotes", "./playSustains", "./waitForNote", "./fromDevice"], function(require, exports, __playNotesM__, __playSustainsM__, __waitForNoteM__, __fromDeviceM__) {
    /// <reference path="../../_references.ts" />
    var playNotesM = __playNotesM__;

    var playSustainsM = __playSustainsM__;

    var waitForNoteM = __waitForNoteM__;

    var fromDeviceM = __fromDeviceM__;

    var o;
    var Basic = (function () {
        function Basic(device, song, metronome, scene, params) {
            this.device = device;
            this.song = song;
            this.metronome = metronome;
            this.scene = scene;
            this.params = params;
            o = this;
            o.correctTimesInParams();
            o.subscribeToParamsChange();
            o.assignClasses();
        }
        Basic.prototype.step = function () {
            o.playNotes.play();
            o.playSustains.play();
            o.metronome.play(o.params.readOnly.p_elapsedTime);
            o.scene.redraw(o.params.readOnly.p_elapsedTime, o.params.readOnly.p_isPaused);
            var isFreeze = o.waitForNote.isFreeze();
            o.hideTimeBarIfStops(isFreeze);
            return o.updateTime(isFreeze);
        };
        Basic.prototype.correctTimesInParams = function () {
            if(typeof o.params.readOnly.p_initTime == 'undefined') {
                o.params.setParam("p_initTime", -2 * o.song.timePerBar);
            }
            if(typeof o.params.readOnly.p_elapsedTime == 'undefined') {
                o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
            }
        };
        Basic.prototype.subscribeToParamsChange = function () {
            o.params.subscribe("players.Basic", "^p_elapsedTime$", function (name, value) {
                o.reset();
            });
        };
        Basic.prototype.reset = function () {
            o.scene.unsetAllActiveIds();
            o.metronome.reset();
            var idsBelowCurrentTime = o.getIdsBelowCurrentTime();
            o.waitForNote.reset(idsBelowCurrentTime);
            o.playNotes.reset(idsBelowCurrentTime);
        };
        Basic.prototype.getIdsBelowCurrentTime = function () {
            return o.song.playerTracks.map(o.getIdBelowCurrentTime);
        };
        Basic.prototype.getIdBelowCurrentTime = function (notes) {
            if(notes.length > 0) {
                var id = notes.length - 1;
                while(id >= 0 && notes[id] && notes[id].time > o.params.readOnly.p_elapsedTime) {
                    id--;
                }
                return id;
            }
        };
        Basic.prototype.assignClasses = function () {
            o.fromDevice = new fromDeviceM.FromDevice(o.device, o.scene, o.params, o.song.playerTracks);
            o.playNotes = new playNotesM.PlayNotes(o.device, o.scene, o.params, o.song.playerTracks);
            o.playSustains = new playSustainsM.PlaySustains(o.device, o.params, o.song.sustainNotes);
            o.waitForNote = new waitForNoteM.WaitForNote(o.device, o.params, o.song.playerTracks, o.fromDevice.onNoteOn);
        };
        Basic.prototype.updateTime = function (isFreeze) {
            var currentTime = o.device.time();
            if(!o.previousTime) {
                o.previousTime = currentTime;
            }
            var duration = currentTime - o.previousTime;
            o.previousTime = currentTime;
            var isSongEnd = o.params.readOnly.p_elapsedTime > o.song.timePerSong + 1000;
            var doFreezeTime = isSongEnd || o.params.readOnly.p_isPaused || isFreeze || /*waiting for hands*/
            duration > 100;/*window was out of focus*/
            
            if(!doFreezeTime) {
                var newElapsedTime = o.params.readOnly.p_elapsedTime + o.params.readOnly.p_speed * duration;
                o.params.setParam("p_elapsedTime", newElapsedTime, true);
            }
            return isSongEnd;
        };
        Basic.prototype.hideTimeBarIfStops = function (isFreeze) {
            if(isFreeze) {
                o.scene.setActiveId(2);
                o.scene.setActiveId(1);
            } else {
                o.scene.unsetActiveId(2);
                o.scene.unsetActiveId(1);
            }
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map
