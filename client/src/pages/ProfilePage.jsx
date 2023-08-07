import React, { useContext } from "react";
import { Context } from "../main";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

const Account = () => {
  const { user, ready, setready, setuser, setisAuthentic, isAuthentic } =
    useContext(Context);

  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  const logout = async () => {
    setready(true);
    await axios.post("/logout", {}, { withCredentials: true });
    setisAuthentic(false);
    setuser(null);
    setready(true);
  };
  if (!ready) {
    return "Loading...";
  }

  if (!isAuthentic) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto ">
          Logged in as {user?.name} ({user?.email})<br />
          <button onClick={logout} className="primary mt-3 max-w-sm">
            LogOut
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default Account;
