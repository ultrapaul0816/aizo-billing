import React, { useEffect, useState } from "react";
import "./notif.scss";
import { Tag, Button, Icon } from "@blueprintjs/core";
import { UserAPI } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    // UserAPI.getProfileDetails().then(res=>{
    //     console.log(res)
    // })
    if (localStorage) {
      const profile = JSON.parse(localStorage.getItem("user"));
      console.log(profile);
      setProfile(profile);
    }
  }, []);
  return (
    <div className="profile">
      <div className="profile-head">
        <div className="profile-head-left">
          <img src={require("../utils/images/avatar.png")} />
          <div className="edit-mask">
            <Icon icon="cloud-upload" />
          </div>
        </div>
        <div className="profile-head-right">
          {profile && (
            <>
              <span>{profile?.username ?? <i>Unknown</i>}</span>
              <Tag minimal>Id: {profile?.user_id}</Tag>

              <Tag intent="primary">{profile?.user_type}</Tag>
            </>
          )}
        </div>
      </div>
      <ul className="profile-body">
        <li>
          <div>
            <Icon icon="lock" />
            Permission
          </div>
          <Icon icon="chevron-right" />
        </li>
        <li>
          <div>
            <Icon icon="key" />
            Change Password
          </div>
          <Icon icon="chevron-right" />
        </li>
      </ul>
    </div>
  );
}
