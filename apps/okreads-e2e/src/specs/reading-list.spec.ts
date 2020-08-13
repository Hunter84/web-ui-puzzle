import { $, $$, browser, ExpectedConditions } from 'protractor';
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

  it('Then: I should remove an item and be able to undo removing it.', async () => {
    const firstReadingListItem = await $('.reading-list-item--details--title').getText();

    const readingListItemRemove = await $('[data-testing="remove-from-reading-list"]');
    await readingListItemRemove.click();

    const itemsList = await $$('.reading-list-item--details--title').getText();
    expect(itemsList).to.not.include(firstReadingListItem)

    const undoRemove = await $('.mat-simple-snackbar-action');
    await undoRemove.click();

    const finalItemsList = await $$('.reading-list-item--details--title').getText();
    expect(finalItemsList).to.include(firstReadingListItem);
  })
});
