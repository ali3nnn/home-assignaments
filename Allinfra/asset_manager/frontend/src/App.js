import './App.css';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="main">
      <h1 style={{ "textAlign": "center" }} className="heading">ALLINFR<span>A</span> Asset Manager</h1>
      <Home />
    </div>
  );
}

export default App;
