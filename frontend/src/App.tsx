import { useState } from 'react';
import './App.css'

function App() {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSync = async () => {
    console.log('Syncing data...');
    try {
      const response = await fetch('/api/v1/verify-phase-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await response.json();
      console.log('Synced data:', data);
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return (
    <>
      <header role="banner" aria-label="Dashboard Header">
        <h1>Progress Visualization Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <input
                type="text"
                placeholder="Repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px' }}
            />
            <button onClick={handleSync}>Sync</button>
        </div>
      </header>
      <main role="main">
        <p>Welcome to your dashboard.</p>
      </main>
    </>
  )
}

export default App