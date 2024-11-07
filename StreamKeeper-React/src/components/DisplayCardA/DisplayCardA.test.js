import React from 'react';
import ReactDOM from 'react-dom';
import DisplayCardA from './DisplayCardA';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DisplayCardA />, div);
  ReactDOM.unmountComponentAtNode(div);
});