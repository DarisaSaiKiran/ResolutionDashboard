import logo from './logo.svg';
import './ikea.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Resolution from "./components/Resolution";
import UserDashboard from './components/UserDashboard';
import "bootstrap/dist/css/bootstrap.min.css";
import View from './components/View';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resolution />} />
        <Route path="/dash" element={<UserDashboard />} />
        <Route path="/view" element={<View/>}/>

      </Routes>
    </Router>
  );
}

export default App;
