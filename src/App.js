import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "./utils";
import "./global.css";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  const [greeter, setGreeter] = React.useState("...");

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // window.contract is set by initContract in index.js
      window.contract.getGreeter().then(greeterFromContract => {
        setGreeter(greeterFromContract);
      });
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    [showNotification]
  );

  console.log(process.env.NODE_ENV, process.env.CONTRACT_NAME);

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      {window.walletConnection.isSignedIn() && (
        <button className="link" style={{ float: "right" }} onClick={logout}>
          {`Sign out ${window.accountId}`}
        </button>
      )}
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)"
            }}
          >
            {`${greeter} says gm`}
          </label>
        </h1>
        {!window.walletConnection.isSignedIn() ? (
          <>
            <p>
              To make use of the gm app on the NEAR blockchain, you need to sign
              in. The button below will sign you in using NEAR Wallet.
            </p>
            <p style={{ textAlign: "center", marginTop: "2.5em" }}>
              <button onClick={login}>Sign in</button>
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <button
              style={{ margin: "0 auto" }}
              disabled={buttonDisabled}
              onClick={async event => {
                setButtonDisabled(true);

                try {
                  let result = await window.contract.sayGm();
                  console.log(result);
                } catch (e) {
                  alert(
                    "Something went wrong! " +
                      "Maybe you need to sign out and back in? " +
                      "Check your browser console for more info."
                  );
                  throw e;
                } finally {
                  // re-enable the form, whether the call succeeded or failed
                  setButtonDisabled(false);
                }

                // show Notification
                setShowNotification(true);

                // remove Notification again after css animation completes
                // this allows it to be shown again next time the form is submitted
                setTimeout(() => {
                  setShowNotification(false);
                }, 11000);
              }}
            >
              Say it back
            </button>
          </div>
        )}
        <p style={{ textAlign: "center" }}>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/azf20/near-app-test"
          >
            Github
          </a>
        </p>
      </main>
      {showNotification && <Notification />}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        " " /* React trims whitespace around tags; insert literal space character when needed */
      }
      said gm at :{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
