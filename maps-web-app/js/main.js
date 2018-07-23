var config = [{
    initDataTypes: ['webm'],
    videoCapabilities: [{
        contentType: 'video/webm; codecs="vp8"'
    }]
}];

var video = document.querySelector('video');
video.addEventListener('encrypted', handleEncrypted, false);

console.log("Request key system access...");
navigator.requestMediaKeySystemAccess('org.w3.clearkey', config).then(
    function (keySystemAccess) {
        console.log("Key system access recieved. Creating media keys now...");
        return keySystemAccess.createMediaKeys();
    }
).then(
    function (createdMediaKeys) {
        console.log("Media keys created. Setting media keys to video...");
        return video.setMediaKeys(createdMediaKeys);
    }
).catch(
    function (error) {
        console.error('Failed to set up MediaKeys', error);
    }
);

function handleEncrypted(event) {
    console.log("Encrypted video detected. Asking for session setup...");
    if (video.mediaKeys === null) {
        setTimeout(function () { settingUpSession(event) }, 2000)
    } else {
        settingUpSession(event);
    }

}
function settingUpSession(event) {
    console.log("Session setup in progress");
    var session = video.mediaKeys.createSession();
    session.addEventListener('message', handleMessage, false);
    session.generateRequest(event.initDataType, event.initData).catch(
        function (error) {
            console.error('Failed to generate a license request', error);
        }
    );
}

function handleMessage(event) {
    console.log("Request to generated license...");
    var license = generateLicense(event);
    license.then(result => {
        console.log("License generated", result);
        var session = event.target;
        console.log("Updating session with generated license");
        session.update(result).catch(
            function (error) {
                console.error('Failed to update the session', error);
            }
        );
    })

}
var licenseEvent = {};
function generateLicense(event) {
    return new Promise((resolve, reject) => {
        var request = JSON.parse(new TextDecoder().decode(event.message));
        console.log("Getting key from blockchain...");
        Maps.getMediaKey(function (error, result) {
            if (result == null) {
                licenseEvent = event;
                document.getElementById("buyButton").style.display = "block";
                console.log("User doesn't have license to view media");
                return alert("Please buy media by clicking buy button");
            }
            console.log("Decryption key recieved.")
            var keyObj = {
                kty: 'oct',
                alg: 'A128KW',
                kid: request.kids[0],
                k: result
            };
            resolve(new TextEncoder().encode(JSON.stringify({
                keys: [keyObj]
            })));
        });
    });
}
/* Main Code starts here */
setTimeout(() => {
    if (typeof web3 !== 'undefined') {
        console.log("Initializing Metamask...");
        web3 = new Web3(web3.currentProvider);
        if (!web3.eth.accounts[0]) {
            alert("There is some problem in loading your metamask account. Check with metamask plugin.")
            console.error("Not able to load account details from metamask plugin");
        }
        console.log("Retreiving user's ethereum Account...");
        document.getElementById("accountAddress").innerText = web3.eth.accounts[0];
        web3.eth.defaultAccount = web3.eth.accounts[0];
        console.log("Initializing MAPS Contract...");
        var MapsContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "getMediaKey", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "buyMedia", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "msg", "type": "string" }], "name": "mediaBought", "type": "event" }]);
        console.log("Connecting to MAPS public contract...");
        var Maps = MapsContract.at('0x16008bab29088307447e4a348b2c3a9730621b64');

        var mediaBoughtEvent = Maps.mediaBought();

        mediaBoughtEvent.watch(function (error, result) {
            console.log("Buying media successfull");
            if (!error) {
                document.getElementById("buyButton").style.display = "none";
                handleMessage(licenseEvent);
            }

        });

        function buyMedia() {
            console.log("Media buy initiated...");
            var buyButton = document.getElementById("buyButton");
            buyButton.innerText = "Pending...";
            buyButton.disabled = true;

            Maps.buyMedia({ value: 1000000000000000 }, (result) => {
                console.log("Media buy request sent.");
            });
        }

    } else {
        alert("This website will not work without metamask plugin.");

    }
}, 1000);