import { $, browser, ExpectedConditions } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should be able to mark a book as completed', async () => {
    /*
      Currently must have a fresh first item to test this, after code is merged
        my next steps would be to create a cleanup branch to ensure all tests
        from each branch initialized properly and didn't need a fresh item.
     */
    const firstReadingItem = await $('[data-testing="mark-as-read"]').getCssValue('color');
    expect(firstReadingItem).to.include('0, 0, 0');

    const markAsRead = await $('[data-testing="mark-as-read"]');
    await markAsRead.click();

    /*
      Color of icon will change after item is updated from confirmedMarkBookAsRead
        signaling that data and api were completed successfully.
     */
    const updatedFirstReadingItem = await $('[data-testing="mark-as-read"]').getCssValue('color');
    expect(updatedFirstReadingItem).to.not.include('0, 0, 0');
  })
});
