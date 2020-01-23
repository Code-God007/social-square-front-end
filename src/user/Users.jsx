import React, { Component } from "react";
import { list, searchPeople } from "./userapi";
import avatar from "../images/avatar.png";
import { Link, Redirect } from "react-router-dom";
import Spinner from "../core/Spinner";

export default class Users extends Component {
  state = {
    users: [],
    loading: false,
    name: "",
    error: "",
    id: "",
    redirectToProfile: false
  };

  componentDidMount() {
    this.setState({ loading: true });
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data, loading: false });
      }
    });
  }

  search = e => {
    e.preventDefault();
    this.setState({ loading: true });
    searchPeople(this.state.name).then(data => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        this.setState({
          id: data._id,
          redirectToProfile: true,
          loading: false
        });
      }
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { users, loading, error, id, redirectToProfile } = this.state;

    if (loading) {
      return (
        <>
          <Spinner />
          <h4 className="display-4 text-center">Searching...</h4>
        </>
      );
    }

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className="container">
        <div className="jumbotron">
          <h1
            className="my-2"
            style={{ fontFamily: "'Bangers', cursive", fontSize: "3.8rem" }}
          >
            Users
          </h1>

          <div
            className="alert alert-danger"
            style={{ display: !error && "none" }}
          >
            {error}
          </div>

          <form className="my-4">
            <div className="row">
              <div className="col-9">
                <div className="form-group">
                  <input
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    value={this.state.name}
                    placeholder="Search for any User"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <button
                  className="btn btn-raised btn-primary col"
                  onClick={this.search}
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          <div className="row mx-2">
            {users.map((user, id) => (
              <div
                className="card col-md-6 shadow p-3 mb-5 bg-white rounded"
                key={id}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${
                    user._id
                  }?${new Date().getTime()}`}
                  style={{ height: "400px", width: "auto" }}
                  className="img-thumbnail"
                  onError={i => (i.target.src = `${avatar}`)}
                  alt={user.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text lead">{user.bio}</p>
                  <Link to={`user/${user._id}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
