import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksPartialState } from '../books/books.reducer';
import { getBooks } from '../books/books.selectors';
import {
  READING_LIST_FEATURE_KEY,
  readingListAdapter,
  ReadingListPartialState,
  State
} from './reading-list.reducer';
import { Book, ReadingListItem, LastUpdatedBook } from '@tmo/shared/models';

export const getReadingListState = createFeatureSelector<
  ReadingListPartialState,
  State
>(READING_LIST_FEATURE_KEY);

const {
  selectEntities,
  selectAll,
  selectTotal
} = readingListAdapter.getSelectors();

export const getReadingListEntities = createSelector(
  getReadingListState,
  selectEntities
);

export interface ReadingListBook extends Book, Omit<ReadingListItem, 'bookId'> {
  isAdded: boolean;
}

export const getAllBooks = createSelector<
  BooksPartialState & ReadingListPartialState,
  Book[],
  Record<string, ReadingListItem>,
  ReadingListBook[]
>(getBooks, getReadingListEntities, (books, entities) => {
  return books.map(b => ({ ...b, isAdded: Boolean(entities[b.id]) }));
});

const readingList = createSelector(getReadingListState, selectAll);

export const getReadingList = createSelector(readingList, getReadingListState, (list, state) => {
  return list.map(b => ({ ...b, isAdded: Boolean(state.lastUpdated && state.lastUpdated.id === b['id']) }));
});

export const getLastUpdatedBook = createSelector(getReadingListState, (state) => {
  return state.lastUpdated;
});

export const getTotalUnread = createSelector(getReadingListState, selectTotal);
