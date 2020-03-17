import React from "react";
import ReactDOM from "react-dom";
// import axios from "axios";
import { Welcome } from "./components/Welcome";
import App from "./components/App";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from './reducer/reducer'
import {init} from './components/socket'

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component = "";

if (location.pathname === "/welcome") {
    //Render registration page
    component = <Welcome />;
} else {
    // render logo
    init(store)
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));

//Previous statement was:
// //Class components CAN have state but functions not
// class HelloWorld extends React.Component {
//     constructor() {
//         super();
//         this.state = {};

//         //Important to bind "this" to the function as the functions has their own this also.
//         this.handleClick = this.handleClick.bind(this)
//     }
//     componentDidMount() {
//         //Lifecycle method
//         //Here we make an axios request

//         setTimeout(() => {
//             let name = "Jesus from SetState!!!";
//             this.setState({
//                 user: {
//                     name
//                 }
//             });
//         }, 2000);
//     }
//     handleClick() {
//         this.setState({
//             user: {name:'Prueba en la funcion'}
//         })
//     }

//     render() {
//         return (
//             <div>
//                 <p className="headline">
//                     Hello, World {this.state.user && this.state.user.name}!
//                 </p>
//                 <p onClick={this.handleClick}> Im a click component </p>
//                 <User name={this.state.user && this.state.user.name} />
//             </div>
//         );
//     }
// }

// function User (props){
//     console.log(props)
//     return <h1>User!</h1>
// }
