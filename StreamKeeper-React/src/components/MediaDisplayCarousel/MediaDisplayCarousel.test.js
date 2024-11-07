import React from 'react';
import ReactDOM from 'react-dom';
import MediaDisplayCarousel from './MediaDisplayCarousel';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MediaDisplayCarousel />, div);
  ReactDOM.unmountComponentAtNode(div);
});