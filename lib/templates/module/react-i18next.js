import React, {Component, Fragment} from "react";
import i18next from "i18next";

export default class NewComponent extends Component {
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