import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.css"
import React from "react"
import ReactDOM from "react-dom"
import NavBar from './components/Navbar';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import HomePage from './components/Home';
import LoginPage from './components/Login';
import SignUp from './components/SignUp';
import SearchTag from './components/SearchTag';
import MoreData from './components/MoreData'


const App=()=>{

    
    return (
        <Router>
        <div className="">
            <NavBar/>
            <Switch>
                <Route path="/login">
                    <LoginPage/>
                </Route>
                <Route path="/moredata">
                    <MoreData/>
                </Route>
                <Route path="/searchtag">
                    <SearchTag/>
                </Route>
                <Route path="/signup">
                    <SignUp/>
                </Route>
                <Route path="/">
                    <HomePage/>
                </Route>
            </Switch>
        </div>
        </Router>
    )
}

ReactDOM.render(<App/>,document.getElementById('root'))