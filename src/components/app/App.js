import React from 'react';
import './App.css';
import UserList from '../lists/UserList';
import TourneyDetail from '../tourney/TourneyDetail';
import { Route, Switch, Link } from 'react-router-dom';
import PlayerDetail from '../user/PlayerDetail';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import Tourney from '../tourney/Tourney';
import Organize from '../organize/Organize';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { USER_FIELDS } from '../../fragments';

const GET_USER = gql`
    query getUser($user: UserWhere) {
        users(where: $user) {
            ...UserFields
        }
    }
    ${USER_FIELDS}
`;

const NEW_USER = gql`
    mutation CreateUser($newUser: [UserCreateInput!]!) {
      createUsers(input: $newUser) {
        users {
          ...UserFields
        }
      }
    }
    ${USER_FIELDS}
`;

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
    case 2:
      return <PersonIcon />
    default:
      return <PersonIcon />
  }
}

export const AuthContext = React.createContext({
  isAuthenticated: false, 
  userId: ''
});

function App() {

  const { loginWithRedirect } = useAuth0();

  const { user, isAuthenticated, logout } = useAuth0();

  let id, email, tag;
  if (user) {
    id = user.sub;
    email = user.email;
    tag = email.substring(0, email.indexOf('@'));
  }

  const [createUser] = useMutation(NEW_USER, {
    refetchQueries: [
      { query: GET_USER, variables: {
        user: {
          id: user ? user.sub : '', 
        }
      }},
    ],
  });

  useQuery(GET_USER, {
    variables: {
      user: {
        id: id, 
      }
    },
    onCompleted: data => {
      if (data.users.length === 0 && id && email && tag) {
        createUser({
          variables: {
            newUser: {
              id: id, 
              email: email, 
              tag: tag
            }
          }
        });
      }
    }
  });

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
        {[{text: 'Tourneys', path: '/'}, {text: 'Users', path: '/user'}, {text: 'Profile', path: `/user/${id}`}].map((item, index) => (
          item.text === 'Profile' && !isAuthenticated ? <div key={index}></div> : (
            <Link to={item.path} key={item.text}>
              <ListItem button key={item.text}>
                <ListItemIcon>{renderIcon(index)}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ) 
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
            Tonyment.gg
          </Typography>
          {isAuthenticated ? 
            <Button color="inherit" onClick={() => logout({returnTo: window.location.origin})}>Logout</Button> : 
            <Button color="inherit" onClick={() => loginWithRedirect()}>Login or Sign up</Button>
          }
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
          <AuthContext.Provider value={{isAuthenticated: isAuthenticated, userId: id}} >
            <Route exact path='/' component={Tourney} />
            <Route path='/tourney/:id' component={TourneyDetail} />
            <Route exact path='/user' component={UserList} />
            <Route path='/user/:id' component={PlayerDetail} />
            <Route exact path='/organize' component={Organize} />
          </AuthContext.Provider>
        </Switch>
      </div>
    </div>
  );
}

export default App;
