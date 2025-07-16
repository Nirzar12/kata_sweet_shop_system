const app = require('./app');

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}
