import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserProvider } from './components/Context.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
  <QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
</UserProvider>
)
