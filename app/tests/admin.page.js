import { Selector } from 'testcafe';

class AdminPage {
  constructor() {
    this.pageId = '#admin-page'; // Ensure this ID is assigned in your React component
    this.pageSelector = Selector(this.pageId);

    // Selectors for elements in the AdminPage component
    this.paginationTable = Selector('#admin-pagination-table'); // Ensure this ID is assigned to your pagination table
    this.embeddedButton = Selector('#embedded-button'); // Ensure this ID is assigned to your embedded button
    this.updateDatabaseButton = Selector('#update-database-button'); // Assign and use the correct ID for the update database button
    this.statusSquare1 = Selector('#status-square-1'); // Ensure this ID is assigned to your first status square
    this.statusSquare2 = Selector('#status-square-2'); // Assign and use the correct ID for the second status square
    this.barChart = Selector('#admin-bar-chart'); // Assign and use the correct ID for the bar chart
    // Add more selectors as needed
  }

  /** Asserts that the Admin page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts that the pagination table is displayed. */
  async isPaginationTableDisplayed(testController) {
    await testController.expect(this.paginationTable.exists).ok('Pagination table is not displayed');
  }

  // Add more methods for interacting with and checking other elements as needed
}

export const adminPage = new AdminPage();
