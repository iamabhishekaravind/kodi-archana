import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Devotee } from '../types';

interface Step1Props {
  devotees: Devotee[];
  onDeveoteesChange: (devotees: Devotee[]) => void;
  onNext: () => void;
}

export function Step1DevoteeDetails({ devotees, onDeveoteesChange, onNext }: Step1Props) {
  const [nakshatras, setNakshatras] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch('/nakshatram.json')
      .then(res => res.json())
      .then(data => setNakshatras(data))
      .catch(err => console.error('Failed to load nakshatras:', err));

    fetch('/dates.json')
      .then(res => res.json())
      .then(data => setDates(data))
      .catch(err => console.error('Failed to load dates:', err));
  }, []);

  const addDevotee = () => {
    const newDevotee: Devotee = {
      id: crypto.randomUUID(),
      name: '',
      nakshatra: '',
      date: ''
    };
    onDeveoteesChange([...devotees, newDevotee]);
  };

  const removeDevotee = (id: string) => {
    onDeveoteesChange(devotees.filter(d => d.id !== id));
  };

  const updateDevotee = (id: string, field: keyof Devotee, value: string) => {
    onDeveoteesChange(
      devotees.map(d => d.id === id ? { ...d, [field]: value } : d)
    );
    setErrors(prev => ({ ...prev, [`${id}-${field}`]: '' }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    devotees.forEach(devotee => {
      if (!devotee.name.trim()) {
        newErrors[`${devotee.id}-name`] = 'Name is required';
      }
      if (!devotee.nakshatra) {
        newErrors[`${devotee.id}-nakshatra`] = 'Please select a nakshatra';
      }
      if (!devotee.date) {
        newErrors[`${devotee.id}-date`] = 'Please select a date';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Devotee Details</h2>

        <div className="space-y-6">
          {devotees.map((devotee, index) => (
            <div key={devotee.id} className="border border-gray-200 rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Devotee {index + 1}</h3>
                {devotees.length > 1 && (
                  <button
                    onClick={() => removeDevotee(devotee.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove devotee"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={devotee.name}
                    onChange={(e) => updateDevotee(devotee.id, 'name', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors[`${devotee.id}-name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter devotee name"
                  />
                  {errors[`${devotee.id}-name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`${devotee.id}-name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nakshatra <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={devotee.nakshatra}
                    onChange={(e) => updateDevotee(devotee.id, 'nakshatra', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors[`${devotee.id}-nakshatra`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Nakshatra</option>
                    {nakshatras.map(nakshatra => (
                      <option key={nakshatra} value={nakshatra}>{nakshatra}</option>
                    ))}
                  </select>
                  {errors[`${devotee.id}-nakshatra`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`${devotee.id}-nakshatra`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={devotee.date}
                    onChange={(e) => updateDevotee(devotee.id, 'date', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors[`${devotee.id}-date`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Date</option>
                    {dates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                  {errors[`${devotee.id}-date`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`${devotee.id}-date`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addDevotee}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Devotee
        </button>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Next: Contact & Payment
          </button>
        </div>
      </div>
    </div>
  );
}
