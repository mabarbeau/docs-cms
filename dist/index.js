"use strict";var _fs=_interopRequireDefault(require("fs")),_readline=_interopRequireDefault(require("readline")),_googleapis=require("googleapis"),_dotenv=_interopRequireDefault(require("dotenv")),_express=_interopRequireDefault(require("express"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}_dotenv["default"].config();// Constants
var PORT=8080,HOST="0.0.0.0",app=(0,_express["default"])();app.get("/",function(a,b){b.send("Hello World"),authorize(printDocTitle)}),app.listen(8080,HOST),console.log("Running on http://".concat(HOST,":").concat(8080));// If modifying these scopes, delete token.json.
var SCOPES=["https://www.googleapis.com/auth/documents.readonly"],TOKEN_PATH="token.json";// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */function authorize(a){var b=new _googleapis.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET,process.env.GOOGLE_REDIRECT_URI);// Check if we have previously stored a token.
_fs["default"].readFile(TOKEN_PATH,function(c,d){return c?getNewToken(b,a):void(b.setCredentials(JSON.parse(d)),a(b))})}/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */function getNewToken(a,b){var c=a.generateAuthUrl({access_type:"offline",scope:SCOPES});console.log("Authorize this app by visiting this url:",c);var d=_readline["default"].createInterface({input:process.stdin,output:process.stdout});d.question("Enter the code from that page here: ",function(c){d.close(),a.getToken(c,function(c,d){return c?console.error("Error retrieving access token",c):void(// Store the token to disk for later program executions
a.setCredentials(d),_fs["default"].writeFile(TOKEN_PATH,JSON.stringify(d),function(a){a&&console.error(a),console.log("Token stored to",TOKEN_PATH)}),b(a))})})}/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/1MJ85BbYgjurQ6AyCaPpdaTHSgalzVouuBybJf5O0uos/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */function printDocTitle(a){var b=_googleapis.google.docs({version:"v1",auth:a});b.documents.get({documentId:"1MJ85BbYgjurQ6AyCaPpdaTHSgalzVouuBybJf5O0uos"},function(a,b){return a?console.log("The API returned an error: "+a):void console.log("The title of the document is: ".concat(b.data.title))})}