
import {initializeApp} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider,signInWithRedirect,getRedirectResult,sendPasswordResetEmail,updateProfile,signOut} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const firebaseConfig={
 apiKey:"AIzaSyB66koQo6FELH0AT9OBtYZgCP4Y5zJigCs",
 authDomain:"echoaga-1a942.firebaseapp.com",
 projectId:"echoaga-1a942",
 storageBucket:"echoaga-1a942.firebasestorage.app",
 messagingSenderId:"483961141529",
 appId:"1:483961141529:web:e07f44179f076aaa14ed88",
 measurementId:"G-HD2VQ20Q0Q"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const googleProvider=new GoogleAuthProvider();

googleProvider.setCustomParameters({prompt:"select_account"});

const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const loginSubmit=document.getElementById("loginSubmit");
const signupSubmit=document.getElementById("signupSubmit");
const googleButton=document.getElementById("googleButton");

onAuthStateChanged(auth,user=>{
 const accountButton=document.getElementById("accountButton");
 const userPill=document.getElementById("userPill");
 const userLabel=document.getElementById("userLabel");
 const logoutButton=document.getElementById("logoutButton");

 if(user){
  accountButton.style.display="none";
  userPill.style.display="flex";
  logoutButton.style.display="inline-block";
  userLabel.textContent=user.displayName||user.email||"My account";
 }else{
  accountButton.style.display="inline-block";
  userPill.style.display="none";
  logoutButton.style.display="none";
 }
});

try{
 const result=await getRedirectResult(auth);
 if(result?.user){
  window.closeAuth();
 }
}catch(error){
 window.openAuth();
 window.showAuthMessage(window.friendlyError(error),true);
}

signupForm.addEventListener("submit",async event=>{
 event.preventDefault();
 window.clearAuthMessage();

 const name=document.getElementById("signupName").value.trim();
 const email=document.getElementById("signupEmail").value.trim();
 const password=document.getElementById("signupPassword").value;

 if(!name){
  window.showAuthMessage("Please enter your name.",true);
  return;
 }

 window.setBusy(signupSubmit,true,"CREATE MY ACCOUNT");

 try{
  const credential=await createUserWithEmailAndPassword(auth,email,password);
  await updateProfile(credential.user,{displayName:name});

  document.getElementById("userLabel").textContent=name;
  window.showAuthMessage("Your ECHOAGA account is ready. Welcome, "+name+"!");

  signupForm.reset();
  setTimeout(window.closeAuth,900);
 }catch(error){
  window.showAuthMessage(window.friendlyError(error),true);
 }finally{
  window.setBusy(signupSubmit,false,"CREATE MY ACCOUNT");
 }
});

loginForm.addEventListener("submit",async event=>{
 event.preventDefault();
 window.clearAuthMessage();

 const email=document.getElementById("loginEmail").value.trim();
 const password=document.getElementById("loginPassword").value;

 window.setBusy(loginSubmit,true,"SIGN IN TO ECHOAGA");

 try{
  await signInWithEmailAndPassword(auth,email,password);
  window.showAuthMessage("You're signed in. Welcome back!");
  loginForm.reset();
  setTimeout(window.closeAuth,700);
 }catch(error){
  window.showAuthMessage(window.friendlyError(error),true);
 }finally{
  window.setBusy(loginSubmit,false,"SIGN IN TO ECHOAGA");
 }
});

window.googleSignIn=async function(){
 window.clearAuthMessage();
 window.setBusy(googleButton,true,"CONNECTING TO GOOGLE…");

 try{
  await signInWithRedirect(auth,googleProvider);
 }catch(error){
  window.showAuthMessage(window.friendlyError(error),true);
  window.setBusy(googleButton,false,"Continue with Google");
 }
};

window.resetPassword=async function(){
 const email=document.getElementById("loginEmail").value.trim();

 if(!email){
  window.showAuthMessage("Enter your email address above first, then tap Forgot your password.",true);
  document.getElementById("loginEmail").focus();
  return;
 }

 try{
  await sendPasswordResetEmail(auth,email);
  window.showAuthMessage("Password reset email sent. Check your inbox and spam folder.");
 }catch(error){
  window.showAuthMessage(window.friendlyError(error),true);
 }
};

window.logoutUser=async function(){
 try{
  await signOut(auth);
  window.showAuthMessage("You have been signed out.");
 }catch(error){
  window.openAuth();
  window.showAuthMessage(window.friendlyError(error),true);
 }
};
   
