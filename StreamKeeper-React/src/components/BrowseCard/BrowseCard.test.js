import React from 'react';
import ReactDOM from 'react-dom';
import BrowseCard from './BrowseCard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BrowseCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});