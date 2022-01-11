import { auth, GoogleAuthProvider, OAuthProvider, db } from "./firebase"; //importing the previously instatiated object from the firebase.js config file
import Web3 from "web3";

//## below the authentication functions ##

export const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope(
      "https://www.googleapis.com/auth/contacts.readonly"
    );
    googleProvider.setCustomParameters({
      login_hint: "user@example.com",
    });
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("https://data.stocksfc.com:3200")
      );
      var account1 = web3.eth.accounts.create();
      await db.collection("users").add({
        uid: user.uid,
        Firstname: user.displayName,
        authProvider: "google",
        email: user.email,
        address: account1.address,
        privateKey: account1.privateKey,
      });
    }
    return { status: true, user: user };
  } catch (err) {
    // console.error(err);
    //alert(err.message);
    return { false: true, error: err.message };
  }
};

export const doSignInWithMicrosoft = async () => {
  const provider = new OAuthProvider("microsoft.com");

  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("https://data.stocksfc.com:3200")
      );
      var account1 = web3.eth.accounts.create();
      await db.collection("users").add({
        uid: user.uid,
        Firstname: user.displayName,
        authProvider: "microsoft",
        email: user.email,
        address: account1.address,
        privateKey: account1.privateKey,
      });
    }
    return { status: true, user: user };
  } catch (err) {
    console.error(err);
    //alert(err.message);
    return { false: true, error: err.message };
  }
};

export const doSignInWithYahoo = async () => {
  const provider = new OAuthProvider("yahoo.com");
  provider.setCustomParameters({
    // Prompt user to re-authenticate to Yahoo.
    prompt: "login",
    // Localize to French.
    language: "en",
  });

  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      const web3 = new Web3(
        new Web3.providers.HttpProvider("https://data.stocksfc.com:3200")
      );
      var account1 = web3.eth.accounts.create();
      await db.collection("users").add({
        uid: user.uid,
        Firstname: user.displayName,
        authProvider: "yahoo",
        email: user.email,
        address: account1.address,
        privateKey: account1.privateKey,
      });
    }
    return { status: true, user: user };
  } catch (err) {
    // console.error(err);
    //alert(err.message);
    return { false: true, error: err.message };
  }
};

//sign up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

//sign in
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

//sign out
export const doSignOut = () =>
  auth.signOut().then(() => {
    window.location.reload();
  });

//## below are two more functions, for resetting or changing passwords ##

//password reset
export const doPasswordReset = (email) => auth.sendPasswordResetEmail(email);

//password change
export const doPasswordChange = (password) =>
  auth.currentUser.updatePassword(password);

export const doGetAnUser = (uid) =>
  db.collection("users").where("uid", "==", uid).get();
//#### for
//     facebook #####
// export const doFacebookSignIn = () => auth.signInWithPopup(facebookProvider);
export const updateUserData = async (userId, userData) => {
  try {
    const userRef = db.collection("users").doc(userId);

    await userRef.update({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};
