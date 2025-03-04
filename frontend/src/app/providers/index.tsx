import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { NextUIProvider } from '@nextui-org/system';
import { I18nProvider } from '@react-aria/i18n';

import { router } from '@shared/router';

import { store } from '../store';

export function Providers() {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <I18nProvider locale="ru">
          <RouterProvider router={router} />
        </I18nProvider>
      </NextUIProvider>
    </Provider>
  );
}
