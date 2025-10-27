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

  // lifestyle selections
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

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10 font-inter">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 text-white text-center py-10">
          <h1 className="text-3xl font-bold">
            International Study Cost Calculator
          </h1>
          <p className="text-gray-300 mt-2">
            Estimate your total study and living expenses
          </p>
        </div>

        {/* Step 1: Country */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">
              Select Your Study Destination
            </h2>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter city (optional)"
              className="w-full p-3 border rounded-lg mb-6"
            />
            <div className="flex justify-end">
              <button
                className="bg-red-700 text-white px-6 py-3 rounded-lg"
                onClick={() =>
                  selectedCountry
                    ? setStep(2)
                    : setMessage("Select a country first.")
                }
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: University */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">
              Choose Your University
            </h2>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              onChange={(e) => {
                const uni = JSON.parse(e.target.value);
                setSelectedUniversity(uni);
                setTuitionFee(parseTuition(uni.price));
              }}
            >
              <option value="">Select a university</option>
              {(universitiesData as any)[selectedCountry]?.map(
                (u: any, i: number) => (
                  <option key={i} value={JSON.stringify(u)}>
                    {u.name}
                  </option>
                )
              )}
            </select>

            {/* {tuitionFee > 0 && (
              <p className="text-gray-600 mb-6">
                Estimated Tuition: {(livingCosts as any)[selectedCountry]?.symbol}
                {tuitionFee.toLocaleString()}
              </p>
            )} */}
            {/* Tuition Fee Display is getting */}

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

            <div className="flex justify-between">
              <button
                className="px-6 py-3 bg-gray-200 rounded-lg"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                className="bg-red-700 text-white px-6 py-3 rounded-lg"
                onClick={() =>
                  !selectedUniversity
                    ? setMessage("Select a university to continue.")
                    : setStep(3)
                }
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div className="p-8 space-y-6">
            <h2 className="text-xl font-semibold">
              Lifestyle & Living Expenses
            </h2>

            {/* Accommodation */}
            <div>
              <label className="block font-medium mb-2">
                What type of accommodation do you prefer?
              </label>
              <select
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="on-campus">On-campus / Dormitory</option>
                <option value="shared-apartment">Shared Apartment</option>
                <option value="studio-apartment">Studio Apartment</option>
                <option value="homestay">Homestay</option>
              </select>
            </div>

            {accommodation === "shared-apartment" && (
              <div>
                <label className="block font-medium mb-2">
                  How many people sharing?
                </label>
                <select
                  value={sharers}
                  onChange={(e) => setSharers(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value={2}>2 People</option>
                  <option value={3}>3 People</option>
                  <option value={4}>4 People</option>
                </select>
              </div>
            )}

            {/* Groceries */}
            <div>
              <label className="block font-medium mb-2">Groceries Plan</label>
              <select
                value={groceries}
                onChange={(e) => setGroceries(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Eating Out */}
            <div>
              <label className="block font-medium mb-2">
                How often do you plan to eat out?
              </label>
              <select
                value={eatingOut}
                onChange={(e) => setEatingOut(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="rarely">Rarely</option>
                <option value="occasionally">Occasionally</option>
                <option value="frequently">Frequently</option>
              </select>
            </div>

            {/* Transport */}
            <div>
              <label className="block font-medium mb-2">
                Main Transportation Mode
              </label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="public-transport">Public Transport</option>
                <option value="walk-cycle">Walk or Cycle</option>
                <option value="ride-sharing">Ride-sharing / Taxis</option>
              </select>
            </div>

            {/* Trips */}
            <div>
              <label className="block font-medium mb-2">
                How often do you travel (trips/vacations)?
              </label>
              <select
                value={trips}
                onChange={(e) => setTrips(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="rarely">Rarely (1–2 trips/year)</option>
                <option value="occasionally">
                  Occasionally (3–4 trips/year)
                </option>
                <option value="frequently">Frequently (5+ trips/year)</option>
              </select>
            </div>

            {/* Social */}
            <div>
              <label className="block font-medium mb-2">
                How often do you engage in social activities?
              </label>
              <select
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="rarely">Rarely</option>
                <option value="occasionally">Occasionally</option>
                <option value="frequently">Frequently</option>
              </select>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block mb-2 font-medium">Subscriptions</label>
                <input
                  type="number"
                  value={subs}
                  onChange={(e) => setSubs(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Bills & Recharge
                </label>
                <input
                  type="number"
                  value={bills}
                  onChange={(e) => setBills(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Miscellaneous</label>
                <input
                  type="number"
                  value={misc}
                  onChange={(e) => setMisc(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                className="px-6 py-3 bg-gray-200 rounded-lg"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
              <button
                className="bg-red-700 text-white px-6 py-3 rounded-lg"
                onClick={handleCalculate}
              >
                Calculate →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && results && (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Estimated Annual Cost
            </h2>
            <h3 className="text-3xl font-bold text-red-700 mb-2">
              {results.symbol}
              {results.total.toLocaleString()}
            </h3>
            <p className="text-gray-500 mb-6">
              Includes tuition and living expenses
            </p>
            <ul className="text-left mx-auto max-w-sm space-y-2 text-gray-700">
              <li>
                Tuition: {results.symbol}
                {results.tuition.toLocaleString()}
              </li>
              <li>
                Accommodation: {results.symbol}
                {results.accommodation.toLocaleString()}
              </li>
              <li>
                Groceries: {results.symbol}
                {results.groceries.toLocaleString()}
              </li>
              <li>
                Eating Out: {results.symbol}
                {results.eatingOut.toLocaleString()}
              </li>
              <li>
                Transport: {results.symbol}
                {results.transport.toLocaleString()}
              </li>
              <li>
                Trips: {results.symbol}
                {results.trips.toLocaleString()}
              </li>
              <li>
                Social: {results.symbol}
                {results.social.toLocaleString()}
              </li>
              <li>
                Subscriptions: {results.symbol}
                {results.subs.toLocaleString()}
              </li>
              <li>
                Bills: {results.symbol}
                {results.bills.toLocaleString()}
              </li>
              <li>
                Miscellaneous: {results.symbol}
                {results.misc.toLocaleString()}
              </li>
            </ul>
            <button
              className="mt-6 bg-red-700 text-white px-6 py-3 rounded-lg"
              onClick={() => setStep(1)}
            >
              Start Over
            </button>
          </div>
        )}

        {/* Message Popup */}
        {message && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="mb-4 text-lg">{message}</p>
              <button
                className="bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => setMessage("")}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
