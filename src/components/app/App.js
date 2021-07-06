import logo from '../../assets/logo.svg';
import './App.css';
import UserList from '../lists/UserList';
import TourneyList from '../lists/TourneyList';
import TourneyDetail from '../tourney/TourneyDetail';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <p>hi</p>
    //     <UserList></UserList>
    //     <TourneyList></TourneyList>
    //   </header>
    // </div>
    <Switch>
      <Route exact path='/' component={TourneyList} />
      <Route path='/tourney/:id' component={TourneyDetail} />
    </Switch>
  );
}

export default App;
