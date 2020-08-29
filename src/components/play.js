import React, { Component } from 'react';
import YouTube from 'react-youtube';
import Header from './header';

class Play extends Component {

    constructor(props) {
        super(props);
        this.viewList = this.viewList.bind(this);
    }

    viewList() {
        console.log('1');
    }

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
                    <YouTube className="video" videoId={this.props.id} opts={opts} onReady={() => this.viewList()} />
                </div>
            </div>
        )
    }

}

export default Play;