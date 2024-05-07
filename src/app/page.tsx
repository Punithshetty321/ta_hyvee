"use client";
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const [ageResponse, genderResponse, nationalResponse] = await Promise.all([
        fetch(`https://api.agify.io?name=${name}`).then((response) => response.json()),
        fetch(`https://api.genderize.io?name=${name}`).then((response) => response.json()),
        fetch(`https://api.nationalize.io?name=${name}`).then((response) => response.json()),
      ]);

      setAge(ageResponse?.age || 'Not found');
      setGender(genderResponse?.gender || 'Not found');
      if (nationalResponse?.country) {
        const countryInfo = nationalResponse.country[0];
        setCountry(countryInfo.country_id);
      } else {
        setCountry('Not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md overflow-hidden">
        <h1 className="text-xl font-bold mb-4 text-center">Guess Age, Gender & Country by Name</h1>
        <form onSubmit={handleSubmit} className="mb-4 px-6">
          <label className="block mb-2">
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 ${
              loading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {age && (
          <div className="bg-gray-100 p-4 rounded-b-md">
            <p className="mb-2">Age: {age}</p>
            <p className="mb-2">Gender: {gender}</p>
            <p>Country: {country}</p>
          </div>
        )}
      </div>
    </div>
  );
}
