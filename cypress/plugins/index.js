/*eslint-disable*/
module.exports = (on, config) => {
  on('task', {
    'db:clear'() {
      console.log('Clearing database...');
      return null;
    }
  });
};
