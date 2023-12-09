import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { adminPage } from './admin.page';
import { userPage } from './user.page';
import { infoSecPage } from './infosec.page';
import { chatbotPage } from './chatbot.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'admin@foo.com', password: 'changeme' };

fixture('meteor-application-template-react localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test admin page shows up', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await navBar.logout(testController);
});

test('Test user page shows up', async (testController) => {
  // Navigate to the User page
  await navBar.gotoUserPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  // Verify the User page is displayed
  await userPage.isDisplayed(testController);
  await navBar.logout(testController);
  // Add more assertions or interactions specific to the User page
});

test('Test InfoSec page shows up', async (testController) => {
  // Navigate to the InfoSec page
  await navBar.gotoInfoSecPage(testController);
  // Verify the InfoSec page is displayed
  await infoSecPage.isDisplayed(testController);
  // Add more assertions or interactions specific to the InfoSec page
});

test('Test Chatbot page shows up', async (testController) => {
  // Navigate to the Chatbot page
  await navBar.gotoChatbotPage(testController);
  // Verify the Chatbot page is displayed
  await chatbotPage.isDisplayed(testController);
  // Add more assertions or interactions specific to the Chatbot page
});

test('Test sending a message to the chatbot', async (testController) => {
  // Navigate to the Chatbot page
  await navBar.gotoChatbotPage(testController);
  // Verify the Chatbot page is displayed
  await chatbotPage.isDisplayed(testController);

  const testMessage = 'Hello, chatbot!'; // Replace with the test message you want to send

  // Send a message to the chatbot
  await chatbotPage.sendMessage(testController, testMessage);
});

test('Test UserMessagesHistoryPage shows up', async (testController) => {
  // Navigate to the UserMessagesHistoryPage
  await testController.navigateTo('/admin/usermessages');

  // Add your assertions or interactions here
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test rate a chatbot message and provide feedback', async t => {
  await navBar.gotoChatbotPage(t);
  await chatbotPage.isDisplayed(t);

  // Send a message to trigger the bot's response if necessary
  await chatbotPage.sendMessage(t, 'hello');

  // Wait for bot's response before rating (adjust wait time as necessary)
  await t.wait(2000); // Example wait time

  // Rate the message and provide feedback
  const feedbackForStars = [
    'Feedback for 1 star',
    'Feedback for 2 stars',
    'Feedback for 3 stars',
    'Feedback for 4 stars',
    'Feedback for 5 stars',
  ];

  await chatbotPage.rateAndProvideFeedbackForAllStars(t, feedbackForStars);

  // Add assertions here to verify that the feedback was submitted
});
