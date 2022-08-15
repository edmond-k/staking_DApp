import React from 'react'
import {Config, DAppProvider, Kovan} from "@usedapp/core"
import { Header } from "./components/Header"
import {Main} from "./components/Main"
import {Container} from "@material-ui/core"


const config: Config = {
  readOnlyChainId: Kovan.chainId,
  readOnlyUrls: {
    [Kovan.chainId]: 'https://kovan.infura.io/v3/',
  },
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000
  }
}

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="md">
      <div>Hi!</div>
      <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
