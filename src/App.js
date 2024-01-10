import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons';

import './App.scss';

const COUNTDOWN_CLOCK = function (updateClock, milliseconds) {
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

class LengthSettings extends React.Component {
    render() {
        return (
            <div className="length-setting">
                <div id={this.props.labelId}>{this.props.labelName}</div>

                <button
                    className="length-button"
                    id={this.props.incrementId}
                    onClick={this.props.onClick}
                    value="+"
                >
                    <FontAwesomeIcon icon={faArrowUp} size="2x" />
                </button>

                <div className="length-button" id={this.props.lengthId}>
                    {this.props.length}
                </div>

                <button
                    className="length-button"
                    id={this.props.decrementId}
                    onClick={this.props.onClick}
                    value="-"
                >
                    <FontAwesomeIcon icon={faArrowDown} size="2x" />
                </button>
            </div>
        );
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countdownClock: '',
            countSeconds: 25 * 60,
            sessionLength: 25,
            breakLength: 5,
            currentTimerType: 'Session',
            currentTimerState: 'stopped',
            alarmColor: { color: 'white' }
        };

        this.setTimer = this.setTimer.bind(this);
        this.updateLength = this.updateLength.bind(this);
        this.setSessionLength = this.setSessionLength.bind(this);
        this.setBreakLength = this.setBreakLength.bind(this);
        this.decrementCount = this.decrementCount.bind(this);
        this.startCountdownClock = this.startCountdownClock.bind(this);
        this.toggleTimerState = this.toggleTimerState.bind(this);
        this.handleAlarm = this.handleAlarm.bind(this);
        this.playWarning = this.playWarning.bind(this);
        this.playAlarm = this.playAlarm.bind(this);
        this.calculateDisplayTime = this.calculateDisplayTime.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    setTimer(num, str) {
        this.setState({
            countSeconds: num,
            currentTimerType: str,
            alarmColor: { color: 'white' }
        });
    }

    updateLength(lengthType, sign, currentLength, timerType) {
        if (this.state.currentTimerState === 'running') {
            return;
        }

        if (this.state.currentTimerType === timerType) {
            if (sign === '-' && currentLength !== 1) {
                this.setState({ [lengthType]: currentLength - 1 });
            } else if (sign === '+' && currentLength !== 60) {
                this.setState({ [lengthType]: currentLength + 1 });
            }
        } else if (sign === '-' && currentLength !== 1) {
            this.setState({
                [lengthType]: currentLength - 1,
                countSeconds: currentLength * 60 - 60
            });
        } else if (sign === '+' && currentLength !== 60) {
            this.setState({
                [lengthType]: currentLength + 1,
                countSeconds: currentLength * 60 + 60
            });
        }
    }
    
    setSessionLength(e) {
        this.updateLength(
            'sessionLength',
            e.currentTarget.value,
            this.state.sessionLength,
            'Break'
        );
    }

    setBreakLength(e) {
        this.updateLength(
            'breakLength',
            e.currentTarget.value,
            this.state.breakLength,
            'Session'
        );
    }

    decrementCount() {
        this.setState({ countSeconds: this.state.countSeconds - 1 });
    }

    startCountdownClock() {
        this.setState({
            countdownClock: COUNTDOWN_CLOCK(() => {
                this.decrementCount();
                this.handleAlarm();
            }, 1000)
        });
    }

    toggleTimerState() {
        if (this.state.currentTimerState === 'stopped') {
            this.startCountdownClock();
            this.setState({ currentTimerState: 'running' });
        } else {
            this.setState({ currentTimerState: 'stopped' });
            if (this.state.countdownClock) {
                this.state.countdownClock.stopClock();
            }
        }
    }

    handleAlarm() {
        let countSeconds = this.state.countSeconds;

        this.playWarning(countSeconds);
        this.playAlarm(countSeconds);

        if (countSeconds < 0) {
            if (this.state.countdownClock) {
                this.state.countdownClock.stopClock();
            }

            if (this.state.currentTimerType === 'Session') {
                this.startCountdownClock();
                this.setTimer(this.state.breakLength * 60, 'Break');
            } else {
                this.startCountdownClock();
                this.setTimer(this.state.sessionLength * 60, 'Session');
            }
        }
    }

    playWarning(_timer) {
        if (_timer < 61) {
            this.setState({ alarmColor: { color: 'yellow' } });
        } else {
            this.setState({ alarmColor: { color: 'white' } });
        }
    }

    playAlarm(_timer) {
        if (_timer === 0) {
            this.setState({ alarmColor: { color: 'red' } });
            this.audioBeep.play();
        }
    }

    calculateDisplayTime() {
        if (this.state.countSeconds < 0) {
            return "00:00";
        }

        let minutes = Math.floor(this.state.countSeconds / 60);
        let seconds = this.state.countSeconds - minutes * 60;

        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return minutes + ':' + seconds;
    }

    resetTimer() {
        this.setState({
            countdownClock: '',
            countSeconds: 25 * 60,
            sessionLength: 25,
            breakLength: 5,
            currentTimerType: 'Session',
            currentTimerState: 'stopped',
            alarmColor: { color: 'white' }
        });

        if (this.state.countdownClock) {
            this.state.countdownClock.stopClock();
        }

        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    }

    render() {
        return (
            <div>
                <h1>Study Timer</h1>

                <div className="length-container">
                    <LengthSettings
                        labelName="Session Length"
                        labelId="session-label"
                        length={this.state.sessionLength}
                        lengthId="session-length"
                        incrementId="session-increment"
                        decrementId="session-decrement"
                        onClick={this.setSessionLength}
                    />
                    <LengthSettings
                        labelName="Break Length"
                        labelId="break-label"
                        length={this.state.breakLength}
                        lengthId="break-length"
                        incrementId="break-increment"
                        decrementId="break-decrement"
                        onClick={this.setBreakLength}
                    />
                </div>

                <div style={this.state.alarmColor}>
                    <div>
                        <div id="timer-label">{this.state.currentTimerType}</div>
                        <div id="time-left">{this.calculateDisplayTime()}</div>
                    </div>
                </div>
                
                <div>
                    <button id="start_stop" onClick={this.toggleTimerState}>
                        <FontAwesomeIcon icon={faPlay} size="2x" />
                        <FontAwesomeIcon icon={faPause} size="2x" />
                    </button>
                    <button id="reset" onClick={this.resetTimer}>
                        <FontAwesomeIcon icon={faRedo} size="2x" />
                    </button>
                </div>

                <audio
                    id="beep"
                    preload="auto"
                    ref={(audio) => {
                        this.audioBeep = audio;
                    }}
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        );
    }
}

export default class App extends React.Component {
    render() {
        return <Timer />
    }
}
