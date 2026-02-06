import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://auth.ticscreek.top',
  realm: 'myrealm',
  clientId: 'blog-spa',
});

export default keycloak;