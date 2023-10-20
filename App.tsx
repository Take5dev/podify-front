import React from 'react';
import {Provider} from 'react-redux';
import store from 'src/store';
import {QueryClient, QueryClientProvider} from 'react-query';

import RootNavigation from 'src/navigation';

import AppContainer from '@components/AppContainer';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <RootNavigation />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
