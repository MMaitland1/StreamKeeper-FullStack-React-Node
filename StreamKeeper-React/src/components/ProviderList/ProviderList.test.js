import React from 'react';
import ReactDOM from 'react-dom';
import ProviderList from './ProviderList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProviderList />, div);
  ReactDOM.unmountComponentAtNode(div);
});