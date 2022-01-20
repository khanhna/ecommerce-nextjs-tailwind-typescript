import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@Components/Navbar';
import Footer from '@Components/Footer';
import store from '@State/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex flex-col min-h-screen m-0">
          {/* Custom checkbox svg initial */}
          <svg className="absolute w-0 h-0 hidden">
            <symbol id="check" viewBox="0 0 12 10">
              <polyline
                points="1.5 6 4.5 9 10.5 1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polyline>
            </symbol>
          </svg>

          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
