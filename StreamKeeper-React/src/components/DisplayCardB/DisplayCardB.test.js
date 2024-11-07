import React from 'react';
import ReactDOM from 'react-dom';
import DisplayCardB from './DisplayCardB';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DisplayCardB />, div);
  ReactDOM.unmountComponentAtNode(div);
});