import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './App.css';

import Home from './home.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  //const host = "http://127.0.0.1:8080"
  const host = "http://34.56.68.51:8080"

  return (
    <>
      <Home host={host}/>
    </>
  );
}

export default App;