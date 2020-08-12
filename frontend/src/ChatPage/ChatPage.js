import React from 'react'
import SubmitButton from '../SubmitButton';


class ChatPage extends React.Component {

    render(){
        return (
            <div className = 'container'>
              Welcome {this.props.UserStore.username}
              <SubmitButton
                text={'Log Out'}
                disabled={false}
                onClick={() => this.props.doLogout()}
              />
            </div>
        )
    }

}

export default ChatPage;