import { AngularAttack2017Page } from './app.po';

describe('angular-attack2017 App', () => {
  let page: AngularAttack2017Page;

  beforeEach(() => {
    page = new AngularAttack2017Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
