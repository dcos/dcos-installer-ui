import classnames from 'classnames';
import {Link} from 'react-router';
import React from 'react';

export default class NavigationItem extends React.Component {
  render() {
    let classes = classnames({
      [this.props.className]: true,
      [this.props.layoutClassName]: true
    });

    return (
      <Link className={classes} to={this.props.link}
        activeClassName={this.props.activeClassName}>
        {this.props.children}
      </Link>
    );
  }
}

NavigationItem.defaultProps = {
  activeClassName: 'is-active',
  className: 'navigation-item',
  layoutClassName: ''
};

NavigationItem.propTypes = {
  activeClassName: React.PropTypes.string,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  layoutClassName: React.PropTypes.string,
  link: React.PropTypes.string.isRequired
};