import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { store } from './store/store';
import { theme } from './common/theme';
import { router } from '@routes/index';
// import { SnackbarProvider } from 'notistack'; // Optional enhancement

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* <SnackbarProvider> */}
        <RouterProvider router={router} />
        {/* </SnackbarProvider> */}
      </ThemeProvider>
    </Provider>
  );
}

export default App;
