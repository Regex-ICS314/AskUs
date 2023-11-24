import { Selector } from 'testcafe';

class InfoSecPage {
  constructor() {
    this.pageId = '#infosec-page'; // ID of your InfoSec page container
    this.pageSelector = Selector(this.pageId);
    // Add more selectors as needed
  }

  /** Asserts that the InfoSec page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  // Add more methods as needed
}

export const infoSecPage = new InfoSecPage();
