import React from "react";

import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const { ZOOM_MEETING_SDK_KEY, ZOOM_MEETING_ID, VERCEL_URL } = process.env;

function randomName() {
  return "User" + Math.floor(Math.random() * 1000000);
}

function App() {
  var authEndpoint = "/auth";
  var sdkKey = ZOOM_MEETING_SDK_KEY;
  var meetingNumber = ZOOM_MEETING_ID;
  var passWord = "";
  var role = 0;
  var userName = randomName();
  var userEmail = `${userName}@example.com`;
  var leaveUrl = `https://${VERCEL_URL}/`;

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    document.getElementById("zmmtg-root").style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          // tk: registrantToken,
          // zak: zakToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
