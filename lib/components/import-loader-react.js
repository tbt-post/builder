import React, {Component, Fragment} from "react";

export default class ImportLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children: props.children
        }
    }

    componentDidMount() {
        this.props.import().then(Children => {
            this.setState({
                children: React.createElement(Children.default)
            })
        }).catch(error => {
            console.log('error', error)
        })
    }

    render() {
        return (
            <Fragment>
                {this.state.children}
            </Fragment>
        )
    }
}