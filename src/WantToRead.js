import React, { Component } from 'react';
import Book from './Book';

class WantToRead extends Component {

  render() {

    const {booksOnShelf} = this.props;
    
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">Want to Read</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {booksOnShelf.map((book, index) => (
              <li key={index}>
                <Book book={book} />
              </li>  
            ))}
          </ol>
        </div>
      </div>
    )
  }

}

export default WantToRead