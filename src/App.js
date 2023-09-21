import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

const DEFAULT_QUERY = 'redux'
const DEFAULT_HPP = '100';

// const PATH_BASE = 'https://hn.foo.bar.com/api/v1';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;

//console.log(url);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: '',
      error: null
    };
  }

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => this.setState({
        error: e
      }));
  }

  componentDidMount = () => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  //定义函数用箭头函数，不需要绑定
  onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: {
          hits: updatedHits,
          page
        }
      }
    });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
    console.log(event.target.value);
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  render() {
    const { results, searchTerm, searchKey, error } = this.state;
    //!result阻止了组件的显示
    const page = (results && results[searchKey] && results[searchKey].page) || 0;

    // if(error){
    //   return <p>Something went wrong</p>;
    // }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {
          error ?
            <div className='interactions'>
              <p>
                Something went wrong
              </p>
            </div>
            :
            results
            && results[searchKey]
            && <Table
              list={results[searchKey].hits}
              onDismiss={this.onDismiss}
            />
        }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    )
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      onChange={onChange}
      value={value}
    />
    <button type='submit'>
      {children}
    </button>
  </form>

const Table = ({ list, onDismiss }) => {
  return (
    <div className="table">
      {
        list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '40%' }}>
              <a href={item.url}>
                {item.title}
              </a>
            </span>
            <span style={{ width: '30%' }}>{item.author}</span>
            <span style={{ width: '10%' }}>{item.num_comments}</span>
            <span style={{ width: '10%' }}>{item.points}</span>
            <span>
              <Button
                onClick={() => {
                  onDismiss(item.objectID)
                }}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )
      }
    </div>
  )
}

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  )
}

Button.defaultProps={
  className: ''
}

Button.prototype = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Search.prototype={
  value:PropTypes.string,
  onChange:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired,
  children:PropTypes.node.isRequired
}



export default App;

export {
  Button,
  Search,
  Table
};
