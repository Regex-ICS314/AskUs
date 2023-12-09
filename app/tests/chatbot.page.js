import { Selector } from 'testcafe';

class ChatbotPage {
  constructor() {
    this.pageId = '#chatbot-page'; // ID of your Chatbot page container
    this.pageSelector = Selector(this.pageId);
    this.chatInputSelector = Selector('#chatbot-input'); // ID of the chat input field
    this.sendButtonSelector = Selector('#chatbot-send'); // ID of the send button
    this.ReactStarsSelector = Selector('#chat-rating'); // Selector for ReactStars
    // Add more selectors as needed
  }

  /** Asserts that the Chatbot page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async sendMessage(testController, message) {
    await testController
      .typeText(this.chatInputSelector, message)
      .click(this.sendButtonSelector);
  }

  // Add a new method to rate a message and provide feedback
  async rateAndProvideFeedbackForAllStars(testController, feedbackTexts) {
    const starsSelector = Selector('#chat-rating');
    const feedbackModalSelector = Selector('#chat-feedback');
    const feedbackInputSelector = Selector('#feedback-input');
    const submitFeedbackButtonSelector = Selector('#feedback-button');

    for (let rating = 1; rating <= 5; rating++) {
      // Click on the star to set the rating
      // eslint-disable-next-line no-await-in-loop
      await testController.click(starsSelector.find('span').nth(rating - 1));

      // Wait for the feedback modal to appear
      // eslint-disable-next-line no-await-in-loop
      await testController.expect(feedbackModalSelector.visible).ok();

      // Type the feedback text for this rating and submit
      // eslint-disable-next-line no-await-in-loop
      await testController
        .typeText(feedbackInputSelector, feedbackTexts[rating - 1])
        .click(submitFeedbackButtonSelector);

      // Optionally, wait for the modal to close before proceeding to the next rating
      // await testController.expect(feedbackModalSelector.visible).notOk();
    }
  }
  // Add more methods as needed for interacting with the chatbot or checking its functionality
}

export const chatbotPage = new ChatbotPage();
