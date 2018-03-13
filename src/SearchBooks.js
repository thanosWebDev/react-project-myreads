import React, { Component } from 'react';
import Book from './Book';
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import trimEnd from 'lodash/trimEnd'
import trimStart from 'lodash/trimStart'


class SearchBooks extends Component {
    static propTypes = {
        allBooks: PropTypes.func.isRequired,
        onMoveShelf: PropTypes.func.isRequired
    }

    state = {
        query: '',
        bookResults: [],
    }

    // Crossreference search results with bookshelves and update them accordingly 
    crossReference = (searchResults) => {
        let results = searchResults;
        const onShelves = this.props.allBooks();
        if (!results.error) {
            const updatedResults = results.map( book => {
                const bookExist =  onShelves.find( b => b.id === book.id );
                bookExist ? book.shelf = bookExist.shelf : book.shelf = 'none';
                return book
            });
            results = updatedResults;
        }
        return results
    }

    searchBooks = (query) => {
        const match = trimEnd(query);
        if (!query) {
            this.setState({ bookResults: []})
        } else {
            BooksAPI.search(match).then((books) => {
                const results = this.crossReference(books)
                if (!this.state.query) {
                    // clear possible async search results
                    this.setState({ bookResults: []})
                } else {
                    this.setState({ bookResults: results})
                }
            })
        }
    }

    updateQuery = (query) => {
        this.setState({ query: trimStart(query) }, function() {
            this.searchBooks(this.state.query); 
        });
    }

    render() {
        const { query } = this.state;
        const gotResults = this.state.bookResults.error ? false : true;
        let finalResults;

        if (gotResults) {
           finalResults = this.crossReference(this.state.bookResults); 
        } else {
            finalResults = [];
        }

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={query}
						    onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    
                    {!query && (
                        <div style={{textAlign: "center", color: "#888"}}>
                            Type keywords for results to display
                        </div>
                    )}
                    
                    {!gotResults && (
                        <div style={{textAlign: "center", color: "#888"}}>
                            No results were found. Please try again.
                        </div>
                    )}

                    { (query && gotResults )&& (
                        <ol className="books-grid">
                            {finalResults.map((book, index) => (
                                <li key={index} 
                                    className={book.shelf !== 'none'? 'book-exists' : ''}>
                                    <Book 
                                    book={book}
                                    onMoveShelf={this.props.onMoveShelf}
                                    />
                                </li>  
                            ))}
                        </ol>
                    )}

                </div>
            </div>
        )
    }

}

export default SearchBooks