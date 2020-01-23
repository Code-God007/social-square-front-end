import React, { Component } from "react";
import { resetPassword } from "../auth";

export default class ResetPassword extends Component {
  state = {
    newPassword: "",
    message: "",
    error: ""
  };

  resetPassword = e => {
    e.preventDefault();
    this.setState({
      message: "",
      error: ""
    });
    resetPassword({
      newPassword: this.state.newPassword,
      resetPasswordLink: this.props.match.params.resetPasswordToken
    }).then(data => {
      if (data.error) {
        this.setState({
          error: data.error
        });
      } else {
        this.setState({
          message: data.message,
          newPassword: ""
        });
      }
    });
  };

  render() {
    return (
      <div className="container">
        <h2
          className="my-5"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
        >
          Reset Your Password
        </h2>

        {this.state.message && (
          <h4 className="alert alert-success">{this.state.message}</h4>
        )}
        {this.state.error && (
          <h4 className="alert alert-warning">{this.state.error}</h4>
        )}

        <form>
          <div className="form-group mt-5">
            <input
              type="password"
              className="form-control"
              placeholder="Your new password"
              value={this.state.newPassword}
              name="newPassword"
              onChange={e =>
                this.setState({
                  newPassword: e.target.value,
                  message: "",
                  error: ""
                })
              }
              autoFocus
            />
          </div>
          <button
            onClick={this.resetPassword}
            className="btn btn-raised btn-primary"
          >
            Reset Password
          </button>
        </form>
      </div>
    );
  }
}
