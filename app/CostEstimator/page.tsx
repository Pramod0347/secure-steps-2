"use client";

import React, { useState } from "react";
import universitiesData from "@/app/components/Home/data/universities.json";
import livingCosts from "@/app/components/Home/data/livingCosts.json";
import countries from "@/app/components/Home/data/countries.json";

export default function Page() {
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [tuitionFee, setTuitionFee] = useState(0);
  const [message, setMessage] = useState("");

  const [accommodation, setAccommodation] = useState("on-campus");
  const [sharers, setSharers] = useState(2);
  const [groceries, setGroceries] = useState("low");
  const [eatingOut, setEatingOut] = useState("rarely");
  const [transport, setTransport] = useState("public-transport");
  const [trips, setTrips] = useState("rarely");
  const [social, setSocial] = useState("rarely");
  const [subs, setSubs] = useState(50);
  const [bills, setBills] = useState(70);
  const [misc, setMisc] = useState(100);
  const [results, setResults] = useState<any>(null);

  const parseTuition = (range: string): number => {
    const nums = range.match(/\d+/g)?.map((n) => parseInt(n, 10)) || [];
    return nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0] || 0;
  };

  const handleCalculate = () => {
    const country = (livingCosts as any)[selectedCountry];
    if (!country) return setMessage("Please select a valid country.");

    let accCost =
      accommodation === "shared-apartment"
        ? country.accommodation["shared-apartment"][sharers]
        : country.accommodation[accommodation];

    const totalMonthly =
      accCost +
      country.groceries[groceries] +
      country.eatingOut[eatingOut] +
      country.transportation[transport] +
      country.personal[social] +
      subs +
      bills +
      misc;

    const annual = totalMonthly * 12 + country.trips[trips];
    const total = tuitionFee + annual;

    setResults({
      symbol: country.symbol,
      tuition: tuitionFee,
      accommodation: accCost,
      groceries: country.groceries[groceries],
      eatingOut: country.eatingOut[eatingOut],
      transport: country.transportation[transport],
      social: country.personal[social],
      subs,
      bills,
      misc,
      trips: country.trips[trips],
      annual,
      total,
    });

    setStep(4);
  };

  const steps = ["Country", "University", "Lifestyle", "Results"];

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        padding: "60px 20px 20px",
        width:"100vw",
        marginTop:"50px"
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#2C2C2C",
            color: "#fff",
            padding: "40px",
            textAlign: "center",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "10px" }}>
            International Study Cost Calculator
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            Estimate your total study and living expenses in your dream study destination
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "20px 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {steps.map((label, index) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: 500,
                color: step === index + 1 ? "#9C1B3C" : "#888",
                position: "relative",
              }}
            >
              {label}
              {steps.length&& (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: 0,
                    width: "100%",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: step >= index + 1 ? "#9C1B3C" : "#e0e0e0",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "30px" }}>
              Select Your Study Destination
            </h2>
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{ fontWeight: 500, color: "#555", marginBottom: "8px", display: "block" }}
              >
                Country
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{ fontWeight: 500, color: "#555", marginBottom: "8px", display: "block" }}
              >
                City (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter city name"
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() =>
                  selectedCountry
                    ? setStep(2)
                    : setMessage("Please select a country to proceed.")
                }
                style={{
                  backgroundColor: "#9C1B3C",
                  color: "#fff",
                  padding: "14px 25px",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  border: "none",
                  boxShadow: "0 4px 10px rgba(156,27,60,0.3)",
                  cursor: "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "30px" }}>
              Choose Your University
            </h2>
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{ fontWeight: 500, color: "#555", marginBottom: "8px", display: "block" }}
              >
                University
              </label>
              <select
                onChange={(e) => {
                  const uni = JSON.parse(e.target.value);
                  setSelectedUniversity(uni);
                  setTuitionFee(parseTuition(uni.price));
                }}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                {selectedCountry}
                <option value="">Select a university</option>
                {(universitiesData as any)[selectedCountry]?.map((u: any, i: number) => (
                  <option key={i} value={JSON.stringify(u)}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-800">
                Estimated Annual Tuition Fee
              </label>
              <input
                type="text"
                readOnly
                value={
                  tuitionFee > 0
                    ? `${
                        (livingCosts as any)[selectedCountry]?.symbol
                      }${tuitionFee.toLocaleString()}`
                    : ""
                }
                placeholder=""
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  backgroundColor: "#E0E0E0",
                  color: "#555",
                  padding: "14px 25px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() =>
                  !selectedUniversity
                    ? setMessage("Select a university to continue.")
                    : setStep(3)
                }
                style={{
                  backgroundColor: "#9C1B3C",
                  color: "#fff",
                  padding: "14px 25px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(156,27,60,0.3)",
                  cursor: "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ padding: "40px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "30px" }}>
              Lifestyle & Living Expenses
            </h2>

            {/* Accommodation */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", marginBottom: "8px", display: "block" }}>
                What type of accommodation do you prefer?
              </label>
              <select
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <option value="on-campus">On-campus / Dormitory</option>
                <option value="shared-apartment">Shared Apartment</option>
                <option value="studio-apartment">Studio Apartment</option>
                <option value="homestay">Homestay</option>
              </select>
            </div>

            {accommodation === "shared-apartment" && (
              <div style={{ marginBottom: "25px" }}>
                <label style={{ fontWeight: 500, color: "#555", marginBottom: "8px", display: "block" }}>
                  How many people sharing?
                </label>
                <select
                  value={sharers}
                  onChange={(e) => setSharers(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                >
                  <option value={2}>2 People</option>
                  <option value={3}>3 People</option>
                  <option value={4}>4 People</option>
                </select>
              </div>
            )}

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", display: "block", marginBottom: "12px" }}>
                Groceries Plan
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="groceries"
                      value={option.value}
                      checked={groceries === option.value}
                      onChange={(e) => setGroceries(e.target.value)}
                      style={{
                        marginRight: "12px",
                        accentColor: "#9C1B3C",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "#333" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", display: "block", marginBottom: "12px" }}>
                How often do you plan to eat out?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "rarely", label: "Rarely" },
                  { value: "occasionally", label: "Occasionally" },
                  { value: "frequently", label: "Frequently" }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="eatingOut"
                      value={option.value}
                      checked={eatingOut === option.value}
                      onChange={(e) => setEatingOut(e.target.value)}
                      style={{
                        marginRight: "12px",
                        accentColor: "#9C1B3C",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "#333" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", display: "block", marginBottom: "12px" }}>
                What is your primary mode of transportation?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "public-transport", label: "Public transport (bus, train)" },
                  { value: "walk-cycle", label: "Walk or Cycle" },
                  { value: "ride-sharing", label: "Ride-sharing/Taxis" }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="transport"
                      value={option.value}
                      checked={transport === option.value}
                      onChange={(e) => setTransport(e.target.value)}
                      style={{
                        marginRight: "12px",
                        accentColor: "#9C1B3C",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "#333" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", display: "block", marginBottom: "12px" }}>
                How often do you plan to travel (trips/vacations)?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "rarely", label: "Rarely (1-2 short trips/year)" },
                  { value: "occasionally", label: "Occasionally (3-4 moderate trips/year)" },
                  { value: "frequently", label: "Frequently (5+ longer trips/year)" }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="trips"
                      value={option.value}
                      checked={trips === option.value}
                      onChange={(e) => setTrips(e.target.value)}
                      style={{
                        marginRight: "12px",
                        accentColor: "#9C1B3C",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "#333" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: 500, color: "#555", display: "block", marginBottom: "12px" }}>
                How often do you plan to engage in social activities/entertainment?
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { value: "rarely", label: "Rarely" },
                  { value: "occasionally", label: "Occasionally" },
                  { value: "frequently", label: "Frequently" }
                ].map((option) => (
                  <label
                    key={option.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="social"
                      value={option.value}
                      checked={social === option.value}
                      onChange={(e) => setSocial(e.target.value)}
                      style={{
                        marginRight: "12px",
                        accentColor: "#9C1B3C",
                        transform: "scale(1.2)",
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "#333" }}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px" }}>
                  Subscriptions
                </label>
                <input
                  type="number"
                  value={subs}
                  onChange={(e) => setSubs(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px" }}>
                  Bills & Recharge
                </label>
                <input
                  type="number"
                  value={bills}
                  onChange={(e) => setBills(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px" }}>
                  Miscellaneous
                </label>
                <input
                  type="number"
                  value={misc}
                  onChange={(e) => setMisc(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  backgroundColor: "#E0E0E0",
                  color: "#555",
                  padding: "14px 25px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleCalculate}
                style={{
                  backgroundColor: "#9C1B3C",
                  color: "#fff",
                  padding: "14px 25px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(156,27,60,0.3)",
                }}
              >
                Calculate →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && results && (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "20px" }}>
              Estimated Annual Cost
            </h2>
            <h3 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#9C1B3C", marginBottom: "10px" }}>
              {results.symbol}
              {results.total.toLocaleString()}
            </h3>
            <p style={{ color: "#555", marginBottom: "25px" }}>
              Includes tuition and living expenses
            </p>
            <ul
              style={{
                textAlign: "left",
                margin: "0 auto",
                maxWidth: "400px",
                color: "#333",
                lineHeight: "1.8",
              }}
            >
              <li>Tuition: {results.symbol}{results.tuition.toLocaleString()}</li>
              <li>Accommodation: {results.symbol}{results.accommodation.toLocaleString()}</li>
              <li>Groceries: {results.symbol}{results.groceries.toLocaleString()}</li>
              <li>Eating Out: {results.symbol}{results.eatingOut.toLocaleString()}</li>
              <li>Transport: {results.symbol}{results.transport.toLocaleString()}</li>
              <li>Trips: {results.symbol}{results.trips.toLocaleString()}</li>
              <li>Social: {results.symbol}{results.social.toLocaleString()}</li>
              <li>Subscriptions: {results.symbol}{results.subs.toLocaleString()}</li>
              <li>Bills: {results.symbol}{results.bills.toLocaleString()}</li>
              <li>Miscellaneous: {results.symbol}{results.misc.toLocaleString()}</li>
            </ul>
           <button
              className="mt-6 bg-red-700 text-white px-6 py-3 rounded-lg"
              onClick={() => {
                setStep(1); // Go to Step 1
                setSelectedCountry(""); // Clear country selection
                setSelectedUniversity(null); // Clear university selection
                setTuitionFee(0); // Reset tuition fee
                setResults(null); // Clear previous results
              }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Message Popup */}
      {message && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "20px", color: "#333" }}>
              {message}
            </p>
            <button
              onClick={() => setMessage("")}
              style={{
                backgroundColor: "#9C1B3C",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}