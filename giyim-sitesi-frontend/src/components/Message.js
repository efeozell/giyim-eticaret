import React from 'react';
import './Message.css';

const Message = ({variant = 'info', children }) => {
    if(!children) {
        return null;
    }

    return (
        <div className={`alert alert-${variant}`}>
            {children}
        </div>
    )
}

export default Message; 