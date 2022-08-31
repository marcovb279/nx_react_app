import styled from 'styled-components';
import NxWelcome from './nx-welcome';
import * as React from 'react';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <NxWelcome title="proton-app" />
    </StyledApp>
  );
}

export default App;
