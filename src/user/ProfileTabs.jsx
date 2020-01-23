import React from "react";
import Followers from "./Followers";
import Following from "./Following";

export class ProfileTabs extends React.Component {
  render() {
    const { followers, following } = this.props;
    return (
      <>
        <Followers followers={followers} />
        <Following following={following} />
      </>
    );
  }
}

export default ProfileTabs;
