import React, {Component} from 'react';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            city: '',
            status: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:3000/logindata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state),
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </label>
                <label>
                    City:
                    <select
                        value={this.state.city}
                        name="city"
                        onChange={this.handleChange}
                    >
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                    </select>
                </label>
                <label>
                    Status:
                    <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={this.state.status === 'Active'}
                        onChange={this.handleChange}
                    />Active
                    <input
                        type="radio"
                        name="status"
                        value="Inactive"
                        checked={this.state.status === 'Inactive'}
                        onChange={this.handleChange}
                    />Inactive
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default Form;