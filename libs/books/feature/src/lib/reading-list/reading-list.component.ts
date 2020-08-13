import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToReadingList, getLastUpdatedBook, getReadingList, removeFromReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book, LastUpdatedBook } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnInit {
  readingList$ = this.store.select(getReadingList);

  lastUpdatedBook$ = this.store.select(getLastUpdatedBook);
  lastUpdatedBook: LastUpdatedBook;


  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.lastUpdatedBook$.subscribe(book => {
      if (!book) return;
      if (!this.lastUpdatedBook || this.lastUpdatedBook.time < book.time) {
        this.lastUpdatedBook = book;
        return this.bookUpdated(book.status);
      }
    });
  }

  undoRemoveFromReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  bookUpdated(status) {
    const addedAlert = this.snackBar.open(status, 'undo');
    addedAlert.onAction().subscribe(()=> {
      if (status === 'added') {
        this.removeFromReadingList(this.lastUpdatedBook);
      } else {
        this.undoRemoveFromReadingList(this.lastUpdatedBook);
      }
    });
  }
}
