import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export class LengthSettings extends React.Component {
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
