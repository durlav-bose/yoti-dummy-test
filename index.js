const {
  DocScanClient,
  SessionSpecificationBuilder,
  RequestedDocumentAuthenticityCheckBuilder,
  RequestedLivenessCheckBuilder,
  RequestedTextExtractionTaskBuilder,
  RequestedFaceMatchCheckBuilder,
  SdkConfigBuilder,
  NotificationConfigBuilder,
} = require("yoti");
const fs = require("fs");
const path = require("path");
const { SandboxDocScanClientBuilder } = require("@getyoti/sdk-sandbox");

const SANDBOX_CLIENT_SDK_ID = "47045794-6514-434e-bd00-9e18f22d67fa";
const PEM = fs.readFileSync("key/privateKey.pem", "utf8");

const docScanClient = new DocScanClient(SANDBOX_CLIENT_SDK_ID, PEM);

const sandboxClient = new SandboxDocScanClientBuilder()
  .withClientSdkId(SANDBOX_CLIENT_SDK_ID)
  .withPemString(PEM)
  .build();

// create session
const documentAuthenticityCheck =
  new RequestedDocumentAuthenticityCheckBuilder().build();

//Liveness check with 3 retries
const livenessCheck = new RequestedLivenessCheckBuilder()
  .forZoomLiveness()
  .withMaxRetries(3)
  .build();

//Face Match Check with manual check set to fallback
const faceMatchCheck = new RequestedFaceMatchCheckBuilder()
  .withManualCheckFallback()
  .build();

//ID Document Text Extraction Task with manual check set to fallback
const textExtractionTask = new RequestedTextExtractionTaskBuilder()
  .withManualCheckFallback()
  .build();

//Configuration for the client SDK (Frontend)
const sdkConfig = new SdkConfigBuilder()
  .withAllowsCameraAndUpload()
  .withPresetIssuingCountry("GBR")
  .withSuccessUrl("https://www.google.com/")
  .withErrorUrl("https://www.youtube.com/")
  .build();

//Buiding the Session with defined specification from above
const sessionSpec = new SessionSpecificationBuilder()
  .withClientSessionTokenTtl(600)
  .withResourcesTtl(604800)
  .withUserTrackingId("user-sp1")
  .withRequestedCheck(documentAuthenticityCheck)
  .withRequestedCheck(livenessCheck)
  .withRequestedCheck(faceMatchCheck)
  .withRequestedTask(textExtractionTask)
  .withSdkConfig(sdkConfig)
  .build();

docScanClient
  .createSession(sessionSpec)
  .then((session) => {
    const sessionId = session.getSessionId();
    const clientSessionToken = session.getClientSessionToken();
    const clientSessionTokenTtl = session.getClientSessionTokenTtl();
    console.log(sessionId);
  })
  .catch((err) => {
    console.log(err);
  });
