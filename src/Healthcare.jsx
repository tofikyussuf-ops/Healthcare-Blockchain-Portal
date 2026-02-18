import { ethers } from "ethers";
import { useState, useEffect } from "react";

function Healthcare() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [name, setName] = useState("");
  const [providerAddress, setProviderAddress] = useState("");

  const contractAddress = "0xb4a441f3ca7da3161d1fa95f050cf8644f58bdcf";
  const contractABI =[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "patientID",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "patientName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "diagnosis",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "treatment",
          "type": "string"
        }
      ],
      "name": "addRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        }
      ],
      "name": "authorizedProvider",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "patientID",
          "type": "uint256"
        }
      ],
      "name": "getPatientRecords",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "recordID",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "patientName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "diagnosis",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "treatment",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct HealthcareRecords.Record[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

   // Utility function to check for network connection
   const ensureNetworkConnection = () => {
    if (!provider || !signer) {
      alert("You're not connected to any blockchain");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const connectToWallet = async () => {
      try {
        // Create a provider from the user's injected Ethereum wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Request wallet connection
        await provider.send("eth_requestAccounts", []);

        // Get the signer (connected account)
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        // Get the connected account's address
        const accountAddress = await signer.getAddress();
        setAccount(accountAddress);

        // Connect to the contract with the signer
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contract);

        // Fetch the owner of the contract
        const ownerAddress = await contract.getOwner();
        setIsOwner(accountAddress.toLowerCase() === ownerAddress.toLowerCase());
        // console.log(accountAddress, ownerAddress);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    connectToWallet();
  }, []); 


  //Fetch Patient Records
  const fetchPatientRecords = async () => {
    if (!ensureNetworkConnection()) return;
    console.log("Fetching patient records...");
    if(patientId) {
      try {
        const records = await contract.getPatientRecords(patientId);
        setPatientRecords(records);
        console.log(records);
      } catch (error) {
        console.error("Error fetching patient records", error);
      }
    }
  }


  //Add Patient Record
  const addRecord = async () => {
    if (!ensureNetworkConnection()) return;
    console.log("Adding patient record...");
      try {
        const tx = await contract.addRecord(patientId, name, diagnosis, treatment);
        await tx.wait();
        console.log(`Patient record with ID ${patientId} added successfully`);
        fetchPatientRecords();
      } catch (error) {
        console.error("Error adding patient record", error);
      }
  }

  //Authorize Provider
const authorizeProvider = async () => {
  if (!ensureNetworkConnection()) return;
    console.log("Authorizing provider...");
    if(isOwner) {
      try {
        const tx = await contract.authorizedProvider(providerAddress);
        await tx.wait();
        console.log(`Provider ${providerAddress} authorized successfully`);

      } catch (error) {
        console.error("Only contract owner can authorize different providers", error)
    }
  }
}

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-green-600 font-bold">HealthCare Application</h1>
      <div>
        <p>Connected Account: {account}</p>
        {isOwner && <p>You are the contract owner</p>}
      </div>

      <div className="flex flex-col justify-start items-start w-full lg:w-[60%] gap-3 mt-10 border-2 border-gray-200 p-4 rounded-lg bg-gray-100">
        <h2>Fetch Patient Records</h2>
        <input
          type="number"
          name="patient"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button onClick={fetchPatientRecords}>Fetch Records</button>
      </div>
      <div className="flex flex-col justify-start items-start w-full lg:w-[60%] gap-3 mt-10 border-2 border-gray-200 p-4 rounded-lg bg-gray-100">
        <h2>Add Patient Records</h2>
        <input
          type="text"
          name="patient"
          placeholder="Enter Patient's Id"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <input
          type="text"
          name="patient"
          placeholder="Enter Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="patient"
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <input
          type="text"
          name="patient"
          placeholder="Treatment"
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
        />
        <button onClick={addRecord}>Add Record</button>
      </div>
      <div className="flex flex-col justify-start items-start w-full lg:w-[60%] gap-3 mt-10 border-2 border-gray-200 p-4 rounded-lg bg-gray-100">
        <h2>Authorize HealthCare Provider</h2>
        <input
          type="text"
          name="patient"
          placeholder="Provide Address"
          value={providerAddress}
          onChange={(e) => setProviderAddress(e.target.value)}
        />
        <button onClick={authorizeProvider}>Authorize Provider</button>
      </div>
      <div className="mt-5">
        <h2>Patient Records</h2>
        {patientRecords.map((record) => (
          <div key={record.id}>
            {/* <p>Patient ID: {record.recordID.toNumber()}</p> */}
            <p>Name: {record.patientName}</p>
            <p>Diagnosis: {record.diagnosis}</p>
            <p>Treatment: {record.treatment}</p>
            <p>Timestamp: {record.timestamp ? new Date(record.timestamp.toNumber() * 1000).toLocaleString() : "N/A"}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Healthcare;
