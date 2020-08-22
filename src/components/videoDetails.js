import React, { Component } from 'react';
import Header from './header';
import baseUrl from '../shared/baseUrl';

class VideoDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedVideo: null,
        }
        this.getDetails = this.getDetails.bind(this);
    }

    componentDidMount() {
        if (this.state.selectedVideo === null) this.getDetails();
    }

    getDetails() {
        fetch(baseUrl + 'download/videos/' + this.props.id)
            .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.err);
                    error.response = response;
                    throw error;
                }
            },
                error => {
                    throw error;
                })
            .then(response => {
                return response.json();
            })
            .then(response => {
                response = JSON.parse(response);
                this.setState({ selectedVideo: response.items });
            })
            .catch(error => { console.log(error) });
    }

    render() {

        let details = [];
        if (this.state.selectedVideo) {
            details = this.state.selectedVideo.map((video, index) => {
                const tags = (() => {
                    if (video.snippet.tags) {
                        return (
                            <ul className="list-unstyled">
                                {video.snippet.tags.map((tag, index) => {
                                    return (
                                        <span className="details-tag" key={index}> #{tag} </span>
                                    )
                                })}
                            </ul>
                        )
                    }
                    else return(<div></div>)
                })

                const categories = (() => {
                    if (video.topicDetails) {
                        return (
                            <ul className="list-unstyled">
                                {video.topicDetails.topicCategories.map((category, index) => {
                                    return (
                                        <div><a className="details-category" rel="noopener noreferrer" target="_blank" href={category} key={index}>{category}</a></div>
                                    )
                                })}
                            </ul>
                        )
                    }
                    else return(<div></div>)
                })

                return (
                    <div key="selectedVideo" className="details">
                        <div className="details-title">{video.snippet.title}</div>
                        <div className="details-content">
                            <div className="details-channel">Channel--- {video.snippet.channelTitle}</div>
                            <ul className="list-unstyled details-stat">
                                <span className="fa fa-eye"><span>{video.statistics.viewCount}</span></span>
                                <span className="fa fa-thumbs-up"><span>{video.statistics.likeCount}</span></span>
                                <span className="fa fa-thumbs-down"><span>{video.statistics.dislikeCount}</span></span>
                                <span className="fa fa-comments"><span>{video.statistics.commentCount}</span></span>
                            </ul>
                            {tags()}
                            <div className="details-desp">{video.snippet.description}</div>
                            {categories()}
                        </div>
                    </div>
                )
            })
        }

        return (
            <div>
                <Header></Header>
                <div className="popular-list">{details}</div>
            </div>
        )
    }
}

export default VideoDetails;