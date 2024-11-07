import React from 'react';
import ReactDOM from 'react-dom';
import DisplayCardCarousel from './DisplayCardCarousel';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DisplayCardCarousel />, div);
  ReactDOM.unmountComponentAtNode(div);
});