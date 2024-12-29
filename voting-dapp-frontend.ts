// components/VotingInterface.tsx
import React, { useState, useEffect } from 'react';
import { useAndromedaClient } from '@andromedaprotocol/andromeda-js-hooks';

interface VotingProps {
  contractAddress: string;
}

export const VotingInterface: React.FC<VotingProps> = ({ contractAddress }) => {
  const [proposals, setProposals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = useAndromedaClient();

  // Fetch current voting results
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await client.query(contractAddress, {
        get_results: {}
      });
      setProposals(response.results);
    } catch (err) {
      setError('Failed to fetch results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cast a vote
  const castVote = async (proposal: string) => {
    try {
      setLoading(true);
      await client.execute(contractAddress, {
        vote: { proposal }
      });
      await fetchResults(); // Refresh results after voting
    } catch (err) {
      setError('Failed to cast vote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [contractAddress]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Voting System</h2>
      
      <div className="grid gap-4">
        {Object.entries(proposals).map(([proposal, votes]) => (
          <div key={proposal} className="border p-4 rounded">
            <h3 className="text-lg mb-2">{proposal}</h3>
            <p>Current votes: {votes}</p>
            <button
              onClick={() => castVote(proposal)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
