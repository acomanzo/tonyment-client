import logo from '../../assets/logo.svg';
import './App.css';
import UserList from '../lists/UserList';
import TourneyList from '../lists/TourneyList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>hi</p>
        <UserList></UserList>
        <TourneyList></TourneyList>
      </header>
    </div>
  );
}

export default App;
