import React from "react";
import MenuHeader from "./Includes/Menu";
import Footer from "./Includes/Footer";

/**
 * The main structure of the layout
 * @param props
 * @returns {*}
 * @constructor
 */
const Layout = props => {
    return (
        <div className="App">
            <MenuHeader/>
            {props.children}

            <Footer/>
        </div>
    );
};

export default Layout;
