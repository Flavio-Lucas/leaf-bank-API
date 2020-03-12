export const environment = {
  production: true,
  app_name: 'LIGA',
  icon_name: './assets/img/liga.png',
  api_endpoint: 'https://liga-notas.herokuapp.com/api/prod',
  config: {
    redirectToWhenAuthenticated: '/dashboard/configs',
    redirectToWhenUnauthenticated: '/login',
  },
};
