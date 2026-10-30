import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [voter, setVoter] = useState(() => {
    const saved = localStorage.getItem("votehub_voter");
    return saved ? JSON.parse(saved) : null;
  });
  const [votingToken, setVotingToken] = useState(() => {
    return localStorage.getItem("votehub_token") || null;
  });
  const [loading, setLoading] = useState(true);

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const loginWithVoterId = async (credentials) => {
    const voterData = typeof credentials === "object" 
      ? credentials 
      : { voterId: credentials, idType: "voter_id" };

    const mockToken = "vt_live_" + Math.random().toString(36).substring(2, 15);
    const sessionVoter = { ...voterData, hasVoted: false };

    setVoter(sessionVoter);
    setVotingToken(mockToken);

    localStorage.setItem("votehub_voter", JSON.stringify(sessionVoter));
    localStorage.setItem("votehub_token", mockToken);

    return true;
  };

  const consumeVotingToken = () => {
    setVotingToken(null);
    localStorage.removeItem("votehub_token");
    if (voter) {
      const updated = { ...voter, hasVoted: true };
      setVoter(updated);
      localStorage.setItem("votehub_voter", JSON.stringify(updated));
    }
  };

  const registerWithEmail = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
      name: name || email.split('@')[0],
      email: email,
      hasVoted: false,
      votedFor: null
    });
    return res;
  };

  const logout = () => {
    setVoter(null);
    setVotingToken(null);
    localStorage.removeItem("votehub_voter");
    localStorage.removeItem("votehub_token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const unsubData = onSnapshot(doc(db, "users", u.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        });
        return () => unsubData();
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userData, 
        voter, 
        votingToken, 
        loginWithEmail, 
        loginWithVoterId, 
        consumeVotingToken, 
        registerWithEmail, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// THIS IS THE PART THE ERROR IS COMPLAINING ABOUT:
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};