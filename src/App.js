import React, { Component } from 'react';
import Home from './components/home';
import Signup from './components/signup';
import Login from './components/login';
import Play from './components/play';
import User from './components/user';
import Footer from './components/footer';
import Profile from './components/profile';
import Popular from './components/popular';
import Help from './components/help';
import Reset from './components/reset';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import history from './history';
import VideoDetails from './components/videoDetails';

class App extends Component {

    constructor(props) {
        super(props);
        this.state ={
            input: '',
            videoList: null,
            searched: false,
            searchParameter: "keyword",
            message: null,
        }
        this.changeMainState = this.changeMainState.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
    }

    changeMessage(mess) {
        this.setState({ message: mess })
    }

    changeMainState(input, videoList, searched, searchParameter) {
        this.setState({
            input: input,
            videoList: videoList,
            searched: searched,
            searchParameter: searchParameter,
        })
    }

    render() {

        const PlayWithId = ({ match }) => {
            return (
                <Play id={match.params.id} />
            )
        }

        const DetailsWithId = ({ match }) => {
            return (
                <VideoDetails id={match.params.id} />
            )
        }

        const PrivateRoute = ({ component: Component, ...rest }) => (
            <Route {...rest} render={(props) => (
                localStorage.getItem('token')
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/user',
                        state: { from: props.location }
                    }} />
            )} />
        );

        return (
            <BrowserRouter>
                <div className="App">
                    <Switch location={this.props.location} history={history}>
                        <Route exact path='/user' component={() => <User message={this.state.message} changeMessage={(mess) => this.changeMessage(mess)} />} />
                        <Route exact path='/user/signup' component={() => <Signup changeMessage={(mess) => this.changeMessage(mess)} />} />
                        <Route exact path='/user/login' component={() => <Login />} />
                        <Route exact path='/help' component={() => <Help />} />
                        <Route exact path='/reset' component={() => <Reset changeMessage={(mess) => this.changeMessage(mess)}/>} />
                        <PrivateRoute exact path='/home' component={() => <Home searchParameter={this.state.searchParameter} searched={this.state.searched} input={this.state.input} videoList={this.state.videoList} changeMainState= {(input, videoList, searched, searchParameter) => this.changeMainState(input, videoList, searched, searchParameter)} />} />
                        <PrivateRoute exact path='/play/:id' component={PlayWithId} />
                        <PrivateRoute exact path='/profile' component={() => <Profile />} />
                        <PrivateRoute exact path='/trending' component={() => <Popular />} />
                        <PrivateRoute exact path='/details/:id' component={DetailsWithId} />
                        <Redirect to="/user" />
                    </Switch>
                </div>
                <Footer></Footer>
            </BrowserRouter>
        );
    }
}

export default App;