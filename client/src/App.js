import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Whiteboard from './components/Whiteboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" component={<Login />} />
          <Route path="/register" component={<Register />} />
          <Route path="/whiteboard/:roomId" component={<Whiteboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;