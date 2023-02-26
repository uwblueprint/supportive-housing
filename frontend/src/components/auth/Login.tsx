import React, { useState } from "react";
import Credentials from "./Credentials";
import Authy from "./Authy";

const Login = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <Credentials
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setToken={setToken}
        toggle={toggle}
        setToggle={setToggle}
      />
      <Authy email={email} password={password} token={token} toggle={!toggle} />
    </>
  );
};

export default Login;
