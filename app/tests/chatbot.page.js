import { Selector } from 'testcafe';

class ChatbotPage {
  constructor() {
    this.pageId = '#chatbot-page'; // ID of your Chatbot page container
    this.pageSelector = Selector(this.pageId);
    // Add more selectors as needed
  }

  /** Asserts that the Chatbot page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  // Add more methods as needed for interacting with the chatbot or checking its functionality
}

export const chatbotPage = new ChatbotPage();
