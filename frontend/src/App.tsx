import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./components/pages/user/HomePage";
import Login from './components/pages/user/Login';
import Register from './components/pages/user/Register.tsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;