const KJUR = require("jsrsasign");

export default function handler(req, res) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const { ZOOM_MEETING_SDK_KEY, ZOOM_MEETING_ID, ZOOM_MEETING_PW } =
    process.env;

  const oPayload = {
    sdkKey: ZOOM_MEETING_SDK_KEY,
    mn: ZOOM_MEETING_ID,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: ZOOM_MEETING_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MEETING_SDK_SECRET
  );

  res.json({
    signature: signature,
    sdkKey: ZOOM_MEETING_SDK_KEY,
    meetingNumber: ZOOM_MEETING_ID,
    passWord: ZOOM_MEETING_PW,
  });
}
