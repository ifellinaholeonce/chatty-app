import React, {Component} from 'react';

class MessageSystem extends Component {
  render() {
    return (
        <div className="message system">
          {this.props.message.content}
        </div>
    );
  }
}
export default MessageSystem;




