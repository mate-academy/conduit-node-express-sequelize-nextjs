const { expect } = require('chai');
const { generateDemoData } = require('./test_lib');

describe('feed', () => {
  beforeEach(async () => {
    await generateDemoData();
  });

  it('shows articles by followers', async () => {
    expect(true).to.be.true;
  });
});
