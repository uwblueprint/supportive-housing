import React, { useState } from "react";
import Signup from "../../forms/Signup";
import TwoFa from "../../auth/TwoFa";

const SignupPage = (): React.ReactElement => {
  const [toggle, setToggle] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Signup
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        toggle={toggle}
        setToggle={setToggle}
      />
      <TwoFa email={email} password={password} token="" toggle={!toggle} />
    </>
  );
};

export default SignupPage;
