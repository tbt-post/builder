import React, {Component, Fragment} from "react";
import {connect} from 'react-redux';


class NewComponent extends Component {
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

export default connect(mapStateToProps, mapDispatchToProps)(NewComponent)