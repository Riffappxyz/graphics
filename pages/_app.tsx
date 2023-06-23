import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig, chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains([chain.mainnet], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_TITLE || 'riff',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: 'black',
          borderRadius: 'small',
        })}
      >
        <link href="https://fonts.cdnfonts.com/css/cerebri-sans" rel="stylesheet"></link>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
