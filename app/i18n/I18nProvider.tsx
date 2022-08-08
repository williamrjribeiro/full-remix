import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

const I18nProvider = ({ children, i18n = i18next }: { children: React.ReactNode, i18n?: typeof i18next }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
)

export default I18nProvider