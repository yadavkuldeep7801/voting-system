import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Global styles
const styles = `
  body {
    font-family: 'Arial', sans-serif;
    background-color: #F49CC4;
    margin: 0;
    padding: 20px;
  }

  h1, h2 {
    color: #172d13;
  }

  h1 {
    text-align: center;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  input[type="text"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #d76f30;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 5px;
  }

  button:hover {
    background-color: #FFD372;
  }

  .party {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .party:hover {
    background-color: #7CAADC;
  }

  .selected {
    background-color: #6bb77b;
  }

  .party img {
    width: 50px;
    height: 50px;
    vertical-align: middle;
    margin-right: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table, th, td {
    border: 1px solid black;
  }

  th, td {
    padding: 10px;
    text-align: left;
  }
`;

// Static party list
const parties = [
  { id: 1, name: 'BJP', logo: 'https://example.com/bjp-logo.png' },
  { id: 2, name: 'Congress', logo: 'https://example.com/congress-logo.png' },
  { id: 3, name: 'Samajwadi Party', logo: 'https://example.com/samajwadi-logo.png' },
  { id: 4, name: 'Aam Aadmi Party', logo: 'https://example.com/aap-logo.png' },
  { id: 5, name: 'NOTA', logo: 'https://via.placeholder.com/50?text=NOTA' },
];

// Reusable input component
const InputField = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

// Main App
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [vote, setVote] = useState(null);
  const [userVotes, setUserVotes] = useState([]);

  const handleLogin = async ({ aadhar, votingCard }) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { aadhar, votingCard });
      const isAdmin = response.data.isAdmin;
      setLoggedInUser({ aadhar, votingCard, isAdmin });
      setLoggedIn(true);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Check credentials.');
    }
  };

  const handleVote = async (party) => {
    try {
      const response = await axios.post('http://localhost:5000/vote', {
        aadhar: loggedInUser.aadhar,
        votingCard: loggedInUser.votingCard,
        party: party.name,
      });

      setVote(party);
      toast.success(response.data.message || 'Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Voting error.');
    }
  };

  useEffect(() => {
    if (loggedInUser?.isAdmin) {
      axios.get('http://localhost:5000/admin/votes')
        .then(response => {
          setUserVotes(response.data);
        })
        .catch(() => toast.error('Failed to load votes.'));
    }
  }, [loggedInUser]);

  return (
    <>
      <style>{styles}</style>
      <ToastContainer />
      <h1>Voting System</h1>

      {!loggedIn ? (
        <Auth onLogin={handleLogin} />
      ) : loggedInUser.isAdmin ? (
        <VotesTable votes={userVotes} />
      ) : vote === null ? (
        <VotingDashboard parties={parties} onVote={handleVote} />
      ) : (
        <Confirmation vote={vote.name} />
      )}
    </>
  );
};

// Login Component
const Auth = ({ onLogin }) => {
  const [aadhar, setAadhar] = useState('');
  const [votingCard, setVotingCard] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = () => {
    if (aadhar.length === 12 && votingCard.length === 10) {
      onLogin({ aadhar, votingCard });
    } else {
      toast.warning('Enter valid Aadhar (12 digits) and Voting Card (10 digits).');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <InputField
        placeholder="Aadhar Number (12 digits)"
        value={aadhar}
        onChange={(e) => /^\d{0,12}$/.test(e.target.value) && setAadhar(e.target.value)}
      />
      <InputField
        placeholder="Voting Card Number (10 digits)"
        value={votingCard}
        onChange={(e) => /^\d{0,10}$/.test(e.target.value) && setVotingCard(e.target.value)}
      />
      <InputField
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

// Vote Selection
const VotingDashboard = ({ parties, onVote }) => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [confirmingVote, setConfirmingVote] = useState(false);

  const handleVote = (party) => {
    setSelectedParty(party);
    setConfirmingVote(true);
  };

  const confirmVoting = () => {
    onVote(selectedParty);
    setSelectedParty(null);
    setConfirmingVote(false);
  };

  const cancelVoting = () => {
    setSelectedParty(null);
    setConfirmingVote(false);
  };

  return (
    <div className="container">
      <h2>Vote for Your Party</h2>
      {parties.map((party) => (
        <div
          key={party.id}
          className={`party ${selectedParty?.name === party.name ? 'selected' : ''}`}
          onClick={() => handleVote(party)}
        >
          <img src={party.logo} alt={`${party.name} logo`} />
          <span>{party.name}</span>
        </div>
      ))}

      {confirmingVote && selectedParty && (
        <div>
          <p>Confirm vote for <strong>{selectedParty.name}</strong>?</p>
          <button onClick={confirmVoting}>Confirm Vote</button>
          <button onClick={cancelVoting}>Cancel</button>
        </div>
      )}
    </div>
  );
};

VotingDashboard.propTypes = {
  parties: PropTypes.array.isRequired,
  onVote: PropTypes.func.isRequired,
};

// Vote Confirmed
const Confirmation = ({ vote }) => (
  <div className="container">
    <h2>Vote Confirmed</h2>
    <p>Thank you for voting for <strong>{vote}</strong>.</p>
  </div>
);

Confirmation.propTypes = {
  vote: PropTypes.string.isRequired,
};

// Admin Vote Table
const VotesTable = ({ votes }) => (
  <div className="container">
    <h2>User Votes</h2>
    <table>
      <thead>
        <tr>
          <th>User (Aadhar-VotingCard)</th>
          <th>Party</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {votes.map((vote, index) => (
          <tr key={index}>
            <td>{vote.aadhar}-{vote.votingCard}</td>
            <td>{vote.party}</td>
            <td>{new Date(vote.time).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

VotesTable.propTypes = {
  votes: PropTypes.array.isRequired,
};

export default App;
