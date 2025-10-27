import { useState } from 'react';

interface Plan {
  type: string;
  price: number;
}

interface PricingPlansProps {
  plans: Plan[];
  onChange: (plans: Plan[]) => void;
}

export function PricingPlans({ plans, onChange }: PricingPlansProps) {
  const [newType, setNewType] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const addPlan = () => {
    if (!newType || !newPrice) return;
    onChange([...plans, { type: newType, price: parseFloat(newPrice) }]);
    setNewType('');
    setNewPrice('');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removePlan = (index:any) => {
    onChange(plans.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Pricing Plans</label>
      
      <div className="space-y-2">
        {plans.map((plan, index) => (
          <div key={index} className="flex items-center gap-2">
            <input 
              type="text" 
              value={plan.type}
              placeholder="Plan name (e.g. Monthly, Student)"
              onChange={(e) => {
                const updatedPlans = [...plans];
                updatedPlans[index].type = e.target.value;
                onChange(updatedPlans);
              }}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            />
            <input 
              type="number" 
              value={plan.price}
              placeholder="Price"
              onChange={(e) => {
                const updatedPlans = [...plans];
                updatedPlans[index].price = parseFloat(e.target.value);
                onChange(updatedPlans);
              }}
              className="w-32 rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removePlan(index)}
              className="text-black hover:text-black p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Plan name"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-32 rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={addPlan}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-black"
        >
          Add Plan
        </button>
      </div>
    </div>
  );
}