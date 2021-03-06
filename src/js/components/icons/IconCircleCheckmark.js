import classnames from 'classnames';
import React from 'react';

class IconCircleCheckmark extends React.Component {
  render() {
    let classes = classnames('icon icon-circle-checkmark', {
      [`icon-${this.props.size}`]: this.props.size
    }, this.props.className);

    return (
      <svg
        className={classes}
        height="64px"
        viewBox="0 0 64 64"
        width="64px"
        {...this.props}>
        <defs>
          <linearGradient id="gradient-pink-purple" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef468b" />
            <stop offset="100%" stopColor="#9351e5" />
          </linearGradient>
        </defs>
        <g className="icon-circle-checkmark-group">
          <path d="M60.76,32a29,29,0,0,0-1.62-9.58l-1.89.66A27,27,0,1,1,48,10.46l1.21-1.59h0A29,29,0,1,0,60.76,32Z" fill-rule="evenodd"/>
          <polygon points="59.66 7.93 26.63 40.96 15.98 30.32 14.4 31.9 26.63 44.13 61.24 9.51 59.66 7.93"/>
        </g>
      </svg>
    );
  }
}

IconCircleCheckmark.propTypes = {
  className: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  size: React.PropTypes.oneOf(['small', 'medium', 'large'])
};

module.exports = IconCircleCheckmark;
