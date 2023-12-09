// UserMessagesHistoryPage.page.js
import { Selector } from 'testcafe';

class UserMessagesHistoryPage {
  constructor() {
    this.pageId = '#user-messages-history-page';
    this.pageSelector = Selector(this.pageId);
    this.tableSelector = Selector('table');
  }

  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasTable(testController) {
    await testController.expect(this.tableSelector.exists).ok();
  }
}

export const userMessagesHistoryPage = new UserMessagesHistoryPage();
