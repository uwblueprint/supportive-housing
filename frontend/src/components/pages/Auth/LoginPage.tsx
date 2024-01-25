import React, { useState } from "react";
import Login from "../../forms/Login";
import TwoFa from "../../auth/TwoFa";

const LoginPage = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setToken={setToken}
        toggle={toggle}
        setToggle={setToggle}
      />
      <TwoFa email={email} password={password} token={token} toggle={!toggle} />
    </>
  );
};

export default LoginPage;
