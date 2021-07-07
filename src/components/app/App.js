import React from 'react';
import logo from '../../assets/logo.svg';
import './App.css';
import UserList from '../lists/UserList';
import TourneyList from '../lists/TourneyList';
import TourneyDetail from '../tourney/TourneyDetail';
import { Route, Switch } from 'react-router-dom';
import PlayerDetail from '../user/PlayerDetail';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/ToolBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240
  }
}));

function renderIcon(index) {
  switch (index) {
    case 0:
      return <EventIcon />
    case 1:
      return <PeopleIcon />
  }
}

function App() {

  const containerStyle = {
    margin: '15px'
  };

  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...StaticRange, [anchor]: open});
  };

  const list = (anchor) => (
    <div 
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[{text: 'Tourneys', path: '/'}, {text: 'Users', path: '/user'}].map((item, index) => (
          <Link to={item.path} >
            <ListItem button key={item.text}>
                <ListItemIcon>{renderIcon(index)}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={toggleDrawer("left", true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Tonyrment.gg
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Drawer 
        className={classes.drawer}
        anchor={"left"} 
        open={state["left"]} 
        onClose={toggleDrawer("left", false)}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        {list("left")}
      </Drawer>

      <div style={containerStyle}>
        <Switch>
          <Route exact path='/' component={TourneyList} />
          <Route path='/tourney/:id' component={TourneyDetail} />
          <Route exact path='/user' component={UserList} />
          <Route path='/user/:id' component={PlayerDetail} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
