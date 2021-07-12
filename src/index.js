import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const client = new ApolloClient({
  uri: 'http://localhost:4000', 
  cache: new InMemoryCache({
    typePolicies: {
      Tourney: {
        fields: {
          competitors: {
            merge(existing, incoming) {
              return incoming
            }
          }
        }
      },
    }
  })
});

ReactDOM.render(
  <Auth0Provider 
    domain='dev-fucepp72.us.auth0.com'
    clientId='peuYUf6uAO55kZITgdBOO3vZWT8xM3Nv'
    redirectUri={window.location.origin}
  >
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
