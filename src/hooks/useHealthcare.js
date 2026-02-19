// src/hooks/useHealthcare.js
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export function useHealthcare() {
  const [state, setState] = useState({
    contract: null,
    account: null,
    isOwner: false,
    loading: false,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    setState((prev) => ({ ...prev, loading: true }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // Updated to v6
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );
      const owner = await contract.getOwner();

      setState({
        contract,
        account: address,
        isOwner: address.toLowerCase() === owner.toLowerCase(),
        loading: false,
      });
    } catch (error) {
      console.error("Connection failed", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  return { ...state, connect };
}
