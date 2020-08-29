import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import VideoCard from './videoCard';
import Header from './header';
import { Redirect } from 'react-router-dom';
import history from '../history';
import { Col, Row } from 'reactstrap';

class Popular extends Component {

    constructor(props) {
        super(props);
        this.state = {
            popularList: null,
            redirect: null,
            val: 0,
            username: JSON.parse(localStorage.getItem('currentUser')).username,
        }
        this.getPopular = this.getPopular.bind(this);
        this.handleIcon = this.handleIcon.bind(this);
        this.handleVideo = this.handleVideo.bind(this);
        this.handleAudio = this.handleAudio.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }

    componentDidMount() {
        if (this.state.popularList === null) this.getPopular();
    }

    handleVideo(id) {
        const url = baseUrl + 'download/video/' + id;
        window.open(
            url,
            "_blank");
    }

    handleAudio(id) {
        const url = baseUrl + 'download/audio/' + id;
        window.open(
            url,
            "_blank");
    }

    handlePlay(id) {
        const url = '/play/' + id;
        history.push('/trending');
        this.setState({ redirect: url });
    }

    getPopular() {
        const code = JSON.parse(localStorage.getItem('currentUser')).countryCode;
        fetch(baseUrl + 'download/popular/' + code)
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
                const videos = JSON.parse(response);
                for (let items = 0; items < videos.items.length; items++) {
                    fetch(baseUrl + 'favourite/' + videos.items[items].id + '/' + this.state.username)
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
                        .then((response) => {
                            videos.items[items].favourite = response.exists;
                            const val = this.state.val;
                            this.setState({ popularList: videos.items, val: val + 1 });
                        })
                }
            })
            .catch(error => { console.log(error) });
    }

    handleIcon(index) {
        const clickedVideo = this.state.popularList.slice();
        clickedVideo[index].favourite = !clickedVideo[index].favourite;
        fetch(baseUrl + 'favourite/modify/' + this.state.popularList[index].id + '/' + this.state.username)
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
                this.setState({ popularList: clickedVideo });
            })
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        let list = [];
        if (this.state.popularList) {
            list = this.state.popularList.map((item, index) => {
                const icon = (this.state.popularList[index].favourite) ? 'fa-heart' : 'fa-heart-o';
                return (
                    <VideoCard index={index} icon={icon} item={item} id={item.id} handleIcon={(index) => this.handleIcon(index)} handleVideo={(id) => this.handleVideo(id)} handlePlay={(id) => this.handlePlay(id)} handleAudio={(id) => this.handleAudio(id)} ></VideoCard>
                )
            })
        }

        return (
            <div>
                <Header></Header>
                <Row className="popular-list">
                    <Col className="col-10 offset-1">
                        <div className="search-list">
                            {list}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Popular;