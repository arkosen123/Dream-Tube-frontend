import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Header from './header';

class Play extends Component {

    render() {
        const opts = {
            height: '420',
            width: '720',
            playerVars: {
                rel: 0,
                color: 'white',
            },
        };

        return (
            <div>
                <Header></Header>
                <div className="play popular-list">
                    <YouTube className="video" videoId={this.props.id} opts={opts} />
                </div>
            </div>
        )
    }

}

export default Play;