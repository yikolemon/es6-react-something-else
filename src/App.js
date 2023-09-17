import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux'
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
  }

  setSearchTopStories=(result) =>{
    this.setState({ result });
  }

  fetchSearchTopStories=(searchTerm)=>{
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(e => e);
  }

  componentDidMount=()=>{
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  //定义函数用箭头函数，不需要绑定
  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
    console.log(event.target.value);
  }

  onSearchSubmit=(event)=>{
    const{searchTerm}=this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { result, searchTerm } = this.state;
    //!result阻止了组件的显示

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
          result
          && <Table
          list={result.hits}
          onDismiss={this.onDismiss}
          />
        }
      </div>
    )
  }
}

const Search = ({ value, onChange, onSubmit,children}) =>
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

const Table=({list,onDismiss})=>{
  return (
    <div className="table">
      {
        list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{width:'40%'}}>
              <a href={item.url}>
                {item.title}
              </a>
            </span>
            <span style={{width:'30%'}}>{item.author}</span>
            <span style={{width:'10%'}}>{item.num_comments}</span>
            <span style={{width:'10%'}}>{item.points}</span>
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

function Button(props) {
  const {
    onClick,
    className = '',
    children,
  } = props;
  return (
    <button
      onClick={onClick}
      className={className}
      type='button'>
      {children}
    </button>
  );
}

export default App;
