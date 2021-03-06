import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Book extends Component {
  static propTypes = {
    book: PropTypes.object.isRequired,
    onMoveShelf: PropTypes.func.isRequired
  }

  render() {
    const {book} = this.props;
    const {onMoveShelf} = this.props;
    // Check for missing cover and put a placeholder
    const cover = !book.imageLinks ? '/no_cover.jpg' : book.imageLinks.smallThumbnail;
    // Check for missing author
    const authors = !book.authors ? ['No author available'] : book.authors;

    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${cover})` }}></div>
          <div className="book-shelf-changer">
            <select value={book.shelf}
              onChange={(event) => onMoveShelf(book, event.target.value)}>
              <option value="" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">
          {authors.map((author, index) => (<div key={index}>{author}</div>))}
        </div>
      </div>
    )
  }
}

export default Book