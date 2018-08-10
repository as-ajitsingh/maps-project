## What is MAPS?
MAPS stands for Media Anti Piracy System. MAPS uses technologies such as [EME-Encrypted Media Extention](https://www.w3.org/TR/encrypted-media/) and [Blockchain - Public Ethereum Network](https://www.ethereum.org/) to minimize the losses that occur due to Piracy. As blockchain is a proven platform that provides us complete transparency and data immutability. I have used blockchain as a system that enables a user to buy media. Since media purchase information is on blockchain it acts as a proof of viewing ownership. Also since the blockchain(ethereum) platform eliminates the need for the middleman(such as payment gateway, record keeper etc) transaction cost on blockchain is pretty cheaper than other traditional methods. I have also used EME(Encrypted Media Extention) which is an open initiative of protecting the media through encryption. EME enable browser will easily able to decrypt media on the fly. With the help of EME, I am able to maintain the anti-piracy as media is encrypted before it gets distributed and only intended user(who have viewing rights) can access the key and able to play video.

### Cool technologies but what about user interaction/ease ?
Since I am using very cutting edge technologies like Blockchain and EME, I've taken special care in User Interaction with the system. A user just needs to have metamask plugin installed in its EME supported browser and rest of the things will be taken care automatically. On loading the website, the website automatically checks for the existence of Metamask plugin and then it connects the web app to blockchain and automatically tried to download the key for decryption. If it is able to retrieve the key ( i.e. user already bought the viewer license), it will play the video as it was normal video(without encryption) and If it can not download the key(i.e. user don't have the license to view media), it will ask user to buy media using ethereum contract by enabling the buy button.

### What else you should know about ?
This application uses the metamask plugin to connect to ethereum testnet.
Testnet used in this system is Ropsten. You should have a valid account in ropsten (and few ethers in that wallet) to use this application.
This is just a prototype to demonstrate the capabilities of EME and Blockchain.
Video encryption is done via clearkey implementation which is a symmetric key cryptography.
For simplicity I've stored the key in plain text inside my smart contract in a real scenario, the key should be encrypted with some strong public key cryptography.
Mechanism's other than the clear key can be used.
For Prototype purpose, I've stored video with the project, in another scenario encrypted video can be streamed on demand.
Each video can be encrypted with a different key before streaming it to the user. It will help in identifying the leak in case of somebody is distributing the videos without approval.

### Demo

Demo video is present at - [https://maps.ajitsingh.co/assests/MAPS-Demo.mp4]
