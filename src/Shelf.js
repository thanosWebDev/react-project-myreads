import React, { Component } from 'react';
import Book from './Book';
import PropTypes from 'prop-types'


class Shelf extends Component {
  static propTypes = {
    booksOnShelf: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onMoveShelf: PropTypes.func.isRequired
  }

  render() {

    const {booksOnShelf} = this.props;

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {booksOnShelf.map((book, index) => (
              <li key={index}>
                <Book 
                book={book}
                onMoveShelf={this.props.onMoveShelf}
                />
              </li>  
            ))}
          </ol>
        </div>
      </div>
    )
  }

}

export default Shelf