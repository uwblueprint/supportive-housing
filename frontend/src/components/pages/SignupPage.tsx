import React, { useState } from "react";
import Signup from "../forms/Signup";
import Authy from "../auth/Authy";

const SignupPage = (): React.ReactElement => {
  const [toggle, setToggle] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  return (
    <>
      <Signup
        email={email}
        setEmail={setEmail}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        password={password}
        setPassword={setPassword}
        toggle={toggle}
        setToggle={setToggle}
        emailError={emailError}
        setEmailError={setEmailError}
      />
      <Authy email={email} password={password} token="" toggle={!toggle} />
    </>
  );
};

export default SignupPage;
