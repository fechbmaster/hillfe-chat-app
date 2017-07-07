import { HillfeChatAppPage } from './app.po';

describe('hillfe-chat-app App', () => {
  let page: HillfeChatAppPage;

  beforeEach(() => {
    page = new HillfeChatAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
