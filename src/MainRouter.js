import React from "react";
import { Route, Switch } from "react-router-dom";
import Menu from "./core/Menu";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import NewPost from "./post/NewPost";
import Post from "./post/Post";
import EditPost from "./post/EditPost";
import PrivateRoute from "./auth/PrivateRoute";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

export default function MainRouter() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/post/:postId" component={Post}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/signin" component={Signin}></Route>
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route
          exact
          path="/reset-password/:resetPasswordToken"
          component={ResetPassword}
        />
        <PrivateRoute
          exact
          path="/user/:userId"
          component={Profile}
        ></PrivateRoute>
        <Route exact path="/users" component={Users}></Route>
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute exact path="/findpeople" component={FindPeople} />
        <PrivateRoute exact path="/create/post" component={NewPost} />
        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
      </Switch>
    </div>
  );
}
