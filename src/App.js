import logo from './logo.svg';
import './ikea.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Resolution from "./components/Resolution";
import UserDashboard from './components/UserDashboard';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resolution />} />
        <Route path="/dash" element={<UserDashboard />} />


      </Routes>
    </Router>
  );
}

export default App;
