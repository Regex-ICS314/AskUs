import { Selector } from 'testcafe';

class UserPage {
  constructor() {
    this.pageId = '#user-page'; // ID of your User page container
    this.pageSelector = Selector(this.pageId);
    // Add more selectors as needed
  }

  /** Asserts that the User page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  // Add more methods as needed
}

export const userPage = new UserPage();
