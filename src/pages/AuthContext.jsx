// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [voter, setVoter] = useState(null);
    const [votingToken, setVotingToken] = useState(null); // Single-use token for casting ballot

    const loginWithVoterId = async (voterId, password) => {
        // 1. Call Backend API to verify ID + Password
        // 2. Request single-use voting token from IAM server
        const mockToken = "vt_live_" + Math.random().toString(36).substring(2, 15);

        setVoter({ voterId, hasVoted: false });
        setVotingToken(mockToken);
        return true;
    };

    const consumeVotingToken = () => {
        // Invalidate token locally after ballot submission
        setVotingToken(null);
        if (voter) setVoter({ ...voter, hasVoted: true });
    };

    return (
        <AuthContext.Provider value={{ voter, votingToken, loginWithVoterId, consumeVotingToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);