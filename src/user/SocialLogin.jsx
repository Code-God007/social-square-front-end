import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { socialLogin, authenticate } from "../auth";
import { Redirect } from "react-router-dom";
import "./User.css";

export default class auth extends Component {
  state = {
    redirectToReferrer: false
  };

  responseGoogle = response => {
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl
    };

    socialLogin(user).then(data => {
      if (data.error) {
        console.log("Error Login. Please Try Again");
      } else {
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  responseFacebook = response => {
    // console.log(response);
    const { name, email, id } = response;
    const image = response.picture.data.url;
    const user = {
      password: id,
      name: name,
      email: email,
      imageUrl: image
    };
    socialLogin(user).then(data => {
      if (data.error) {
        console.log("Error Login. Please Try Again");
      } else {
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  componentClicked = () => console.log("Clicked");

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <GoogleLogin
          clientId="305359788686-34je27buae3r0tfah0sb9nh2q86gp11l.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
        <FacebookLogin
          appId="2326387650952701"
          autoLoad={false}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          icon={<i className="fab fa-facebook-f mr-4"></i>}
          cssClass="fbButton"
        />
      </div>
    );
  }
}
