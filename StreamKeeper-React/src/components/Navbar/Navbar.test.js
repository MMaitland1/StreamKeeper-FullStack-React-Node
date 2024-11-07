import React from 'react';
import ReactDOM from 'react-dom';
import navbar from './navbar';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<navbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});