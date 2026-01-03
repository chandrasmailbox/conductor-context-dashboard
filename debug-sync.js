const verifyRepo = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/verify-phase-2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl: 'https://github.com/chandrasmailbox/conductor-context-dashboard' }),
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
};

verifyRepo();