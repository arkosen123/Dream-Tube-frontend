import React, { Component } from 'react';
import baseUrl from '../shared/baseUrl';
import { Button, Input } from 'reactstrap';
import Header from './header';
import { Redirect } from 'react-router-dom';
import history from '../history';
import { Row, Col } from 'reactstrap';
import VideoCard from './videoCard';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            videoList: this.props.videoList,
            redirect: null,
            input: this.props.input,
            searched: this.props.searched,
            val: 0,
            isSearched: false,
            username: JSON.parse(localStorage.getItem('currentUser')).username,
            searchParameter: this.props.searchParameter,
            change: false,
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleVideo = this.handleVideo.bind(this);
        this.handleAudio = this.handleAudio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleIcon = this.handleIcon.bind(this);
        this.changeParameter = this.changeParameter.bind(this);
        this.placeHolder = this.placeHolder.bind(this);
    }

    componentDidMount() {
        if (this.state.searchParameter === 'keyword') document.getElementById('select').value = 'Search by Keyword';
        else document.getElementById('select').value = 'Search by PlaylistId';
    }

    changeParameter() {
        let query = document.getElementById('select').value;
        if (query === "Search by Keyword") this.setState({ videoList: null, input: '', searched: false, searchParameter: 'keyword', isSearched: false, change: true }, () => {
            this.props.changeMainState(this.state.input, this.state.videoList, this.state.searched, this.state.searchParameter);
        })
        else this.setState({ videoList: null, input: '', searched: false, searchParameter: 'playlistId', isSearched: false, change: true }, () => {
            this.props.changeMainState(this.state.input, this.state.videoList, this.state.searched, this.state.searchParameter);
        })
    }

    handleSearch() {
        this.setState({ isSearched: true, videoList: null });
        let query = this.state.input;
        query = encodeURIComponent(query);
        const url = ((this.state.searchParameter) === 'keyword') ? 'download/' : 'download/playlist/';
        fetch(baseUrl + url + query)
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
                    const urlFav = (this.state.searchParameter === 'keyword') ? videos.items[items].id.videoId : videos.items[items].snippet.resourceId.videoId;
                    fetch(baseUrl + 'favourite/' + urlFav + '/' + this.state.username)
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
                            this.setState({ videoList: videos.items, val: val + 1 }, () => {
                                if (this.state.val === videos.items.length) this.setState({ searched: true });
                            });
                        })
                }
            })
            .catch(error => { console.log(error) });
    }

    handleChange() {
        let query = document.getElementById('search').value;
        this.setState({ input: query });
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
        history.push('/home');
        this.setState({ redirect: url });
    }

    handleIcon(index) {
        const clickedVideo = this.state.videoList.slice();
        clickedVideo[index].favourite = !clickedVideo[index].favourite;
        const urlFav = (this.state.searchParameter === 'keyword') ? this.state.videoList[index].id.videoId : this.state.videoList[index].snippet.resourceId.videoId;
        fetch(baseUrl + 'favourite/modify/' + urlFav + '/' + this.state.username)
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
                this.setState({ videoList: clickedVideo });
            })
    }

    placeHolder() {
        if (this.state.searchParameter === "keyword") return `Keyword like "Best Songs"`;
        else return `Playlist Id like "PLWc1yfTYfqNEoxtqfqfllbGHV3d2SFNT9"`;
    }

    componentWillUnmount() {
        if(this.state.change === false) this.props.changeMainState(this.state.input, this.state.videoList, this.state.searched, this.state.searchParameter);
        else this.setState({ change: false });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const list = (() => {
            if (this.state.videoList) {
                if (this.state.val === this.state.videoList.length || this.state.searched) {
                    return (
                        <div> {this.state.videoList.map((item, index) => {
                            const icon = (this.state.videoList[index].favourite) ? 'fa-heart' : 'fa-heart-o';
                            const urlFav = (this.state.searchParameter === 'keyword') ? item.id.videoId : item.snippet.resourceId.videoId;
                            return (
                                <VideoCard index={index} icon={icon} id={urlFav} item={item} handleIcon={(index) => this.handleIcon(index)} handleVideo={(id) => this.handleVideo(id)} handlePlay={(id) => this.handlePlay(id)} handleAudio={(id) => this.handleAudio(id)} ></VideoCard>
                            )
                        })
                        }
                        </div>
                    )
                }
            }
            else if (this.state.isSearched === true) {
                return (
                    <div className="no-search">No related videos found for your Search!.. Try something else.</div>
                )
            }
            else return (<div></div>)
        })

        return (
            <div>
                <Header ></Header>
                <Row>
                    <Input className="search-choice ml-5" onChange={() => this.changeParameter()} type="select" name="select" id="select">
                        <option>Search by Keyword</option>
                        <option>Search by PlaylistId</option>
                    </Input>
                    <Col className="col-10 offset-1">
                        <div className="search">
                            <div>
                                <input autoComplete="off" spellCheck="false" value={this.state.input} type="text" id="search" onChange={() => this.handleChange()} className="search-bar" placeholder={this.placeHolder()} />
                                <Button className="search-btn" color="primary" onClick={() => this.handleSearch()}>Search</Button>
                            </div>
                            <div className="search-list">
                                {list()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Home;