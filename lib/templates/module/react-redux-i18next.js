import React, {Component, Fragment} from "react";
import {connect} from 'react-redux';
import i18next from "i18next";

class Component extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                Component
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {...state}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)