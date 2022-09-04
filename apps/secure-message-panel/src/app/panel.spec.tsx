import { render } from '@testing-library/react';

import Panel from './panel';

describe('Panel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Panel />);

    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Panel />);

    expect(getByText(/Welcome secure-message-panel/gi)).toBeTruthy();
  });
});
