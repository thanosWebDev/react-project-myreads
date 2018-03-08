import React from 'react'
import Header from './Header'
import Shelf from './Shelf'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: [],
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false
  }

  // Set initial state: get books from server and filter them to shelves
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      const currentlyReading = books.filter(book => book.shelf === 'currentlyReading');
      const wantToRead = books.filter(book => book.shelf === 'wantToRead');
      const read = books.filter(book => book.shelf === 'read');
      this.setState({ currentlyReading, wantToRead, read })
    })
  }

  //Remove book from current shelf
  removeBook = (book) => {
    const Shelf = book.shelf;
    this.setState(state => ({
      [Shelf]: state[Shelf].filter( b => b.id !== book.id )
    }))
  }

  //Add book to shelf
  addBook = (book, targetShelf) => {
    let bookToMove = book;
    bookToMove.shelf = targetShelf;
    this.setState(state => ({
      [targetShelf]: state[targetShelf].concat([bookToMove])
    }))
  }

  //Move book to new shelf or remove
  moveShelf = (book, targetShelf) => {
  if (targetShelf !== 'none') {
    this.removeBook(book);
    this.addBook(book, targetShelf);
  } else {
    this.removeBook(book);
  }
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <Header />
            <div className="list-books-content">
              <div>
                <Shelf
                  booksOnShelf={this.state.currentlyReading}
                  title="Currently Reading"
                  onMoveShelf={this.moveShelf}
                />
                <Shelf
                  booksOnShelf={this.state.wantToRead}
                  title="Want to Read"
                  onMoveShelf={this.moveShelf}
                />
                <Shelf
                  booksOnShelf={this.state.read}
                  title="Read"
                  onMoveShelf={this.moveShelf}
                />
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
