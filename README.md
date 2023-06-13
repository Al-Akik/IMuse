# iMuse

iMuse is a unique, music-focused social media application developed with React Native and Node.js. The platform containes most functionalities seen in apps like Instagram, offering an engaging and interactive user experience. Key features include a built-in chat system and a  recommendation algorithm developed from scratch. 

## Setting up Firebase Credentials

In order for the project to work correctly, you will need to replace the variables highlighted with comments in the `app.js` file with the credentials of a free Firestore database that you create. Follow the steps below to set up the Firebase credentials:

1. **Create a Firebase project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project. Make sure to note down the project ID.

2. **Enable Firestore**: In the Firebase project dashboard, go to the Firestore section and click on "Create Database". Choose the "Start in test mode" option for simplicity. Once the database is created, note down the Firestore project ID.

3. **Obtain Firebase configuration**: In the Firebase project dashboard, navigate to the "Settings" (gear icon) > "Project settings" > "General" tab. Scroll down to the "Your apps" section and click on the "CDN" icon (</>). This will display the Firebase configuration code snippet.

4. **Replace credentials in app.js**: Open the `app.js` file in your project. Look for the variables that require replacement and are usually highlighted with comments, such as `apiKey`, `authDomain`, `projectId`, etc. Replace the values of these variables with the corresponding values from your Firebase project configuration.

   ```javascript
   // Example app.js snippet with credentials to replace
   const firebaseConfig = {
     apiKey: '<YOUR_API_KEY>',
     authDomain: '<YOUR_AUTH_DOMAIN>',
     projectId: '<YOUR_PROJECT_ID>',
     // ...
   };

# Running the Project

To run the project, follow these steps:

1. **Install Expo CLI**: First, install Expo CLI globally on your system. Open the terminal and execute the following command:

```
npm install -g expo-cli@4.4.8
```

2. **Ensure Node.js Version**: Ensure that you have Node.js version 16 installed on your system. You can check the Node.js version by running the command:
```
node -v
```

If you don't have Node.js version 16, you can install it manually or use a version manager like nvm.

3. **Navigate to Project Directory**: Open your terminal and navigate to the directory where your project is located. You can use the `cd` command to change directories.

cd /path/to/project


4. **Start the Project**: Once inside the project directory, start the project using Expo CLI. Run the following command:
```
expo start
```
This will start the Expo development server and display a QR code in your terminal.

5. **Run the Project on Device or Simulator**: To run the project on your device or simulator, you have a few options:

- Scan the QR code: Install the Expo Go app on your mobile device and scan the QR code displayed in the terminal. This will open the project on your device.
- Emulator/Simulator: If you have Android or iOS emulators/simulators set up on your system, you can press "a" for Android or "i" for iOS in the terminal to run the project on the respective emulator/simulator.

By following these steps, you will be able to run the project using Expo and test it on your device or emulator.


# Git Commands

1. git init //initialize the folder
2. git remote add origin ssh-key //connect the folder to a repository
3. git add -A //add the modified folders to git
4. git commit -m //commit the changes followed by a message
5. git push origin main //push the changes live on github
6. git pull //pull the change to your machine
7. git checkout master      // gets you "on branch master"
8. git fetch origin        // gets you up to date with origin
9. git merge origin/master
