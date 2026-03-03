import React, { useState, useEffect, useContext } from "react";
import "../../utils/styles/auth.scss";
import { FullScreenWrapper, Grid, Expanded } from "../../components/Layout";
import { InputGroup, Button } from "@blueprintjs/core";
import Notif from "../../components/Notification";
import { UserAPI } from "../../api";
import { updatePermissions } from "../../redux/Permissions/actions";
import { useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { IntlContext } from "../../components/i18n";
import { itemsRequestSuccess } from "../../redux/Company/actions";

let interval = null;
let imageRef = null;
export default function Auth({ history }) {
  const [auth, setAuth] = useState({ username: "", password: "" });
  const [load, setLoad] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        history.push("/home/");
        console.log(user);
        dispatch(updatePermissions(user.permissions));
      }
    }
    setInterval(() => {
      setActiveIndex((a) => (a + 1) % 5);
    }, 4000);
  }, []);

  useEffect(() => clearInterval(interval));

  const handleInput = (evt) => {
    setAuth({ ...auth, [evt.target.name]: evt.target.value });
  };

  useEffect(() => {
    if (imageRef) {
      imageRef.animate(
        {
          opacity: [0, 1, 1],
          transform: ["translateX(10px)", "translateX(-3px)", "translateX(0)"],
        },
        { duration: 200 }
      );
    }
  }, [activeIndex]);

  const login = (e) => {
    e.preventDefault();
    const { username, password } = auth;
    if (!!username && !!password) {
      auth.username = auth.username.trim();
      setLoad(true);
      UserAPI.login(auth).then((res) => {
        console.log("kkkkkkkkkkkkkkkkkkkkkkuuuu", res);
        setLoad(false);
        if (res.success) {
          history.push("/home/");
          dispatch(itemsRequestSuccess({ company_id: res.company_id }));
          localStorage.setItem("company", res.company_id);
          dispatch(updatePermissions(res.permissions));
          Notif.success("Success");
        } else Notif.error("Error while Logging in!");
      });
    } else {
      Notif.error("Please enter username or password");
    }
  };
  const [ChangeLangEN, ChangeLangJP] = useContext(IntlContext);
  const intl = useIntl();
  return (
    <FullScreenWrapper className="main-login">
      <Grid cols={["1fr", "1fr"]} full>
        <Expanded className="s-tab">
          <div className="title">
            <span />
            Aizo Billing
          </div>
          <img
            ref={(ref) => (imageRef = ref)}
            src={`${process.env.PUBLIC_URL}/media/auth_back_${activeIndex}.svg`}
          />
          <div className="indicators">
            {new Array(5).fill("").map((_, i) => (
              <span className={i === activeIndex ? "active-ind" : ""} />
            ))}
          </div>
          <Button
            onClick={() => {
              setActiveIndex((activeIndex + 1) % 5);
            }}
            icon="chevron-right"
            large
          />
        </Expanded>
        <div elevation={4} className="login-cont">
          <span>
            <FormattedMessage id="Welcome" />
          </span>
          <p className="login">
            <FormattedMessage id="Log in" />
          </p>
          <div className="inp-cont">
            <form onSubmit={login} onInput={handleInput}>
              <label className="label">
                {/* <IoMdPerson />  */}
                Username
              </label>
              <InputGroup
                placeholder={intl.formatMessage({ id: "Username" })}
                type="text"
                name="username"
                large
                autoComplete="true"
                value={auth.username}
              />
            </form>
            <form onSubmit={login} onInput={handleInput}>
              <label className="label">
                {/* <IoMdKey />  */}
                Password
              </label>
              <InputGroup
                placeholder={intl.formatMessage({ id: "Password" })}
                name="password"
                large
                autoComplete="true"
                type="password"
                value={auth.password}
              />
            </form>
            <Button
              text={intl.formatMessage({ id: "Login" })}
              intent="primary"
              rightIcon="arrow-right"
              loading={load}
              large
              onClick={login}
              className="login-btn"
            />
          </div>

          <Button
            minimal
            text={intl.formatMessage({ id: "Forgot Password?" })}
            className="f-gp"
          />
          <div className="lang_change_btn_grp">
            <Button
              minimal
              className="f-gp"
              style={{ margin: "0" }}
              onClick={ChangeLangJP}
            >
              日本語
            </Button>
            <span>|</span>
            <Button
              minimal
              className="f-gp"
              style={{ margin: "0" }}
              onClick={ChangeLangEN}
            >
              EN
            </Button>
          </div>
        </div>
      </Grid>
    </FullScreenWrapper>
  );
}
