import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, onSnapshot, addDoc, Timestamp, query, orderBy,  } from "firebase/firestore";
import { format } from "date-fns";

const firebaseConfig = {
  apiKey: "AIzaSyAuUnIMrGLF8w12TS3g4Snpund7qRVrzhI",
  authDomain: "chatapp-26619.firebaseapp.com",
  projectId: "chatapp-26619",
  storageBucket: "chatapp-26619.appspot.com",
  messagingSenderId: "577464610406",
  appId: "1:577464610406:web:1f3c38c3c9f4ba480847a7"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Auth
const auth = getAuth();

// Firestore 
const db = getFirestore();

// collection ref
const collref = collection(db, 'chats');

// queries
const q =  query(collref, orderBy('created_at'));

// real time collection data
const msgList = document.querySelector('.msg-list');
onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
        if(change.type === 'added'){
            const data = change.doc.data();
            const when = format(data.created_at.toDate(), 'HH:mm');
           // update ui
           const html = `
                <li class="mt-5 space-x-2">
                    <img class="w-12 h-12 rounded-full" src="./imagesdtyuij.jpg" alt="">
                    <div class="break-words -mt-[3.2rem] pl-[3.2rem]">
                        <div class="flex justify-between items-center">
                            <div class="font-bold">${data.username}</div>
                            <div class="text-sm">${when}</div>
                        </div>
                        <div>${data.message}</div>
                    </div>
                </li>
           `;
            msgList.innerHTML += html;
        };
    });
});

// add chats to db
const addChat = document.querySelector('.add-chat');
addChat?.addEventListener('submit', e => {
    e.preventDefault();
    const now = Timestamp.fromDate(new Date());
    addDoc(collref, {
        message : addChat.message.value,
        username : localStorage.username ? localStorage.username : 'anon',
        created_at : now,
    })
    .then(() => {
        addChat.reset();
    });
});

// Update name
const addName = document.querySelector('.add-name');
addName?.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('username', addName.name.value.trim());
    addName.reset();
});

//searching for chat
const filterChats = (termLow) => {
    Array.from(msgList.children)
        .filter(chat => !chat.textContent.includes(termLow))
        .forEach(chat => chat.classList.add('hidden'));

    Array.from(msgList.children)
        .filter(chat => chat.textContent.includes(termLow))
        .forEach(chat => chat.classList.remove('hidden'));
};

const search = document.querySelector(".search");
search?.addEventListener('keyup', () => {
    const term = search.value.trim();
    const termLow = term.toLowerCase();
    filterChats(termLow);
});

// sign up 
const userSignup = document.querySelector('.signup');
userSignup?.addEventListener('submit', e => {
    e.preventDefault();

    const email = userSignup.email.value
    const password = userSignup.password.value

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("Sucessfull");
        window.location.assign("./chat.html");
        userSignup.reset();
    })
    .catch(err => console.log(err.message));
});


// login
const loginForm = document.querySelector('.login');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("Login Sucessfull");
        window.location.assign("./chat.html");
        loginForm.reset();
    })
    .catch((err) => console.log(err));
});

// Logout
const logOut = document.querySelector('.logout');
logOut?.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
        alert('Logged out Successfully');
        window.location.assign("./signin.html");
    })
    .catch(err => console.log(err));
});