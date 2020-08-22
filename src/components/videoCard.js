import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

class VideoCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            specificVideo: null,
            username: JSON.parse(localStorage.getItem('currentUser')).username,
        }
    }

    render() {

        const display = (() => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const username = user.username;
            if (username !== 'guest') {
                return (
                    <span onClick={() => this.props.handleIcon(this.props.index)} className={`fa ${this.props.icon} fav`}></span>
                )
            }
            else return <div></div>
        })

        return (
            <div className="row card-element" key={this.props.index}>
                <div className="col-lg-5 offset-lg-1">
                    {display()}
                    <img src={this.props.item.snippet.thumbnails.high.url} width="100%" height="85%" className="card-img thumb" alt="..." />
                </div>
                <div className="col-lg-5 video-short-info">
                    <h5 className="card-title">{this.props.item.snippet.title}</h5>
                    <div class="video-buttons">
                        <Button disabled={this.state.username === 'guest'} className="btn-danger video-btn" onClick={() => this.props.handleVideo(this.props.id)}>Download Video</Button>
                        <Button disabled={this.state.username === 'guest'} className="btn-danger video-btn" onClick={() => this.props.handleAudio(this.props.id)}>Download Audio</Button>
                        <Button className="btn-danger video-btn" onClick={() => this.props.handlePlay(this.props.id)}>Play</Button>
                        <Link to={`/details/${this.props.id}`}><Button className="btn-danger video-btn" onClick={() => this.props.handlePlay(this.props.id)}>Video Info</Button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoCard;