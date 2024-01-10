export const COUNTDOWN_CLOCK = function (updateClock, milliseconds) {
    var timeout = null;
    
    var updateTime = new Date().getTime() + milliseconds;

    var countdownUpdater = function () {
        updateTime += milliseconds;
        timeout = setTimeout(countdownUpdater, updateTime - new Date().getTime());
        return updateClock();
    };

    var stopClock = function () {
        return clearTimeout(timeout);
    };

    timeout = setTimeout(countdownUpdater, updateTime - new Date().getTime());
    
    return {
        stopClock: stopClock
    };
};
