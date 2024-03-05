import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Resolution from "./components/Resolution";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Resolution />} />
        

      </Routes>
    </Router>
  );
}

export default App;
