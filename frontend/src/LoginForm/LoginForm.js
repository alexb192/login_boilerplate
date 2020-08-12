import React from 'react';
import InputField from '../InputField';
import SubmitButton from '../SubmitButton';
import UserStore from '../stores/UserStore';

import './LoginForm.css';

import logo from '../images/biscord.png';

class LoginForm extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();
        val = val.replace(/[^A-Za-z0-9]/g, '');
        if (val.length > 12) {
            return;
        }
        
        this.setState({
            [property]: val
        })

    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async userExists(username)
    {
        try {
            let res = await fetch('./userexists', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username
                })
            })

            let result = await res.json();

            if (result.success)
            {
                return true;
            }
            else if (!result.success)
            {
                return false;
            }
        }
        catch (e)
        {
            console.log(e);
        }

    }

    async handleSignUp() {

        let doesUserExist = await this.userExists();

        if (doesUserExist == true)
        {
            alert("User already exists");
            this.resetForm();
            return;
        }

        if (!this.state.username) {
            return;
        }

        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {

            let res = await fetch('./signup', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })

            // tell the user whether it failed or not
            let result = await res.json();
            this.resetForm();
            alert(result.msg);

        }

        catch(e) {
            console.log(e);
            this.resetForm();
        }

    }

    async doLogin() {

        if (!this.state.username) {
            return;
        }

        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {

            let res = await fetch('./login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            })

            let result = await res.json();

            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            }

            else if (result && result.success === false){
                this.resetForm();
                alert(result.msg);
            }

        }

        catch(e) {
            console.log(e);
            this.resetForm();
        }

    }

  render() {
    return (
        <div className="LoginForm">

            <img className="logo" src={logo} alt="" />

            <InputField
                type = 'text'
                placeholder = 'Username'
                value = {this.state.username ? this.state.username : ''}
                onChange = { (val) => this.setInputValue('username', val) }
            />

            <InputField
                type = 'password'
                placeholder = 'Password'
                value = {this.state.password ? this.state.password : ''}
                onChange = { (val) => this.setInputValue('password', val) }
            />

            <SubmitButton 
                text = 'Login'
                disabled = {this.state.buttonDisabled}
                onClick = { () => this.doLogin() }
            />

            <SubmitButton 
                text = 'Sign Up'
                disabled = {this.state.buttonDisabled}
                onClick = { () => this.handleSignUp() }
            />
        
        </div>
    );
  }

}

export default LoginForm;
