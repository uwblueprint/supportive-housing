import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Routes from "../../constants/Routes";
import SampleContext from "../../contexts/SampleContext";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";
import routesAPIClient from "../../APIClients/RoutesAPIClient";

import NavigationBar from "../common/NavigationBar";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const history = useHistory();
  const navigateTo = () => history.push(path);
  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      {text}
    </button>
  );
};

const TeamInfoDisplay = () => {
  const { teamName, numTerms, members, isActive } = useContext(SampleContext);

  const [email, setEmail] = useState<string>("");

  const inviteUser = async (userEmail: string) => {
    await routesAPIClient.inviteUser(userEmail);
  };

  return (
    <div>
      <h2>Team Info</h2>
      <div>Name: {teamName}</div>
      <div># terms: {numTerms}</div>
      <div>
        Members:{" "}
        {members.map(
          (name, i) => ` ${name}${i === members.length - 1 ? "" : ","}`,
        )}
      </div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
      <div>
        <p>Invite User:</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="username@domain.com"
        />
        <button
          onClick={() => inviteUser(email)}
          className="btn btn-primary"
          type="button"
        >
          Invite User
        </button>
      </div>
    </div>
  );
};

const Default = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <NavigationBar />
      <h1>Default Page</h1>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <RefreshCredentials />
        <ResetPassword />
        <Button text="Create Entity" path={Routes.CREATE_ENTITY_PAGE} />
        <Button text="Update Entity" path={Routes.UPDATE_ENTITY_PAGE} />
        <Button text="Display Entities" path={Routes.DISPLAY_ENTITY_PAGE} />
        <Button text="Edit Team" path={Routes.EDIT_TEAM_PAGE} />
        <Button text="Hooks Demo" path={Routes.HOOKS_PAGE} />
      </div>

      <div style={{ height: "2rem" }} />

      <TeamInfoDisplay />
    </div>
  );
};

export default Default;
