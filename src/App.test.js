import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import render from 'react-test-render';


describe('App',()=>{
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    });
})

test('has a valid snapshot',()=>{
  const component =render.create(
    <App/>
  )
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
