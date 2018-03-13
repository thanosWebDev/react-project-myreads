import React from 'react'
import Header from './Header'
import Shelf from './Shelf'
import SearchBooks from './SearchBooks'
import { Route, Link, Redirect, Switch } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {

  // This state hold the tree different shelves
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  // Sets initial state: get books from server and filter them to the shelves
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      const currentlyReading = books.filter(book => book.shelf === 'currentlyReading');
      const wantToRead = books.filter(book => book.shelf === 'wantToRead');
      const read = books.filter(book => book.shelf === 'read');
      this.setState({ currentlyReading, wantToRead, read })
    })
  }

  //Remove book from it's current shelf
  removeBook = (book) => {
    const shelf = book.shelf;
    this.setState(state => ({
      [shelf]: state[shelf].filter( b => b.id !== book.id )
    }))
    // Update the backend server
    BooksAPI.update(book, 'none');
  }

  //Add a book to a shelf
  addBook = (book, targetShelf) => {
    let bookToMove = book;
    // Update book with the new shelf
    bookToMove.shelf = targetShelf;
    this.setState(state => ({
      [targetShelf]: state[targetShelf].concat([bookToMove])
    }))
    // Update the backend server
    BooksAPI.update(book, targetShelf);
  }

  //Move book to a new shelf or remove it from library
  moveShelf = (book, targetShelf) => {
    if (book.shelf === 'none') {
      this.addBook(book, targetShelf);
    } else if (targetShelf !== 'none') {
      this.removeBook(book);
      this.addBook(book, targetShelf);
    } else {
      this.removeBook(book);
    }
  }

  // Return an array with all books in the library for the search component crossreference
  allBooks = () => {
    return this.state.currentlyReading.concat(this.state.wantToRead, this.state.read);
  }

  render() {
    return (
      <div className="app">
        <div className="list-books">
          <Header />
         
          <Switch>
            <Route exact path='/' render={() => (
              <div>
                <div className="list-books-content">
                    <Shelf  booksOnShelf={this.state.currentlyReading}
                            title="Currently Reading"
                            onMoveShelf={this.moveShelf}
                    />
                    <Shelf  booksOnShelf={this.state.wantToRead}
                            title="Want to Read"
                            onMoveShelf={this.moveShelf}
                    />
                    <Shelf  booksOnShelf={this.state.read}
                            title="Read"
                            onMoveShelf={this.moveShelf}
                    />
                </div>
                <div className="open-search">
                  <Link to='/search'>Add a book</Link>
                </div>
              </div>
            )}/>
            <Route exact path='/search' render={() => (
              <SearchBooks  onMoveShelf={this.moveShelf}
                            allBooks={this.allBooks}
              />
            )}/>
            <Route path="*" render={() => (
              <Redirect to='/'  />
            )}/>
          </Switch>
        
        </div>
      </div>
    )
  }
}

export default BooksApp
