import { render } from '@testing-library/react';
import { createTheme } from '@mui/material/styles';
import Panel from './panel';

describe('Panel', () => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Panel theme={darkTheme} />);

    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Panel theme={darkTheme} />);

    expect(getByText(/Welcome secure-message-panel/gi)).toBeTruthy();
  });
});
