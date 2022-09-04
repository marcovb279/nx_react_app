import { createTheme } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Panel from './app/panel';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

root.render(
  <StrictMode>
    <Panel theme={darkTheme} />
  </StrictMode>
);
