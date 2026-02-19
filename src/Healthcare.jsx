// src/Healthcare.jsx
import { useState } from "react";
import { ActionCard } from "./components/ActionCard"; // ✅ CLEAN
import { useHealthcare } from "./hooks/useHealthcare"; // ✅ CLEANuseHealthcare";

function Healthcare() {
  const { account, isOwner, contract, loading } = useHealthcare();

  // Local States for Inputs
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [fetchId, setFetchId] = useState("");
  const [records, setRecords] = useState([]);
  const [authAddress, setAuthAddress] = useState("");

  // Handlers
  // src/Healthcare.jsx

  const handleAdd = async () => {
    // 1. Add this safety check!
    if (!contract) {
      alert(
        "Blockchain not connected yet. Please wait or connect your wallet.",
      );
      return;
    }

    try {
      const tx = await contract.addRecord(
        patientId,
        name,
        diagnosis,
        treatment,
      );
      await tx.wait();
      alert("Record Added!");
    } catch (error) {
      console.error("Add record failed:", error);
    }
  };

  const handleFetch = async () => {
    // 2. Add the same check here!
    if (!contract) return;

    try {
      const data = await contract.getPatientRecords(fetchId);
      setRecords(data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        Connecting to Blockchain...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header logic remains the same... */}

      <main className="grid gap-6 md:grid-cols-2">
        {/* ADD RECORD */}
        <ActionCard title="Add Patient Record" icon="➕">
          <input
            className="input-style"
            placeholder="Patient ID"
            onChange={(e) => setPatientId(e.target.value)}
          />
          <input
            className="input-style"
            placeholder="Patient Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-style"
            placeholder="Diagnosis"
            onChange={(e) => setDiagnosis(e.target.value)}
          />
          <textarea
            className="input-style"
            placeholder="Treatment"
            onChange={(e) => setTreatment(e.target.value)}
          />
          <button onClick={handleAdd} className="btn-primary">
            Submit to Blockchain
          </button>
        </ActionCard>

        {/* FETCH RECORDS */}
        <ActionCard title="Search Records" icon="🔍">
          <div className="flex gap-2">
            <input
              className="input-style"
              placeholder="ID"
              onChange={(e) => setFetchId(e.target.value)}
            />
            <button onClick={handleFetch} className="btn-secondary">
              Search
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {records.map((r, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded border text-sm">
                <p>
                  <strong>{r.patientName}</strong>: {r.diagnosis}
                </p>
                <p className="text-gray-500 italic">{r.treatment}</p>
              </div>
            ))}
          </div>
        </ActionCard>

        {/* ADMIN ONLY: AUTHORIZE */}
        {isOwner && (
          <ActionCard title="Authorize Provider" icon="🛡️">
            <input
              className="input-style"
              placeholder="0x..."
              onChange={(e) => setAuthAddress(e.target.value)}
            />
            <button className="btn-admin">Grant Access</button>
          </ActionCard>
        )}
      </main>
    </div>
  );
}

export default Healthcare;
