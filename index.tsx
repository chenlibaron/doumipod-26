import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { AITutorProvider } from './contexts/AITutorContext';
import { AppProvider } from './contexts/AppContext';
import { UIProvider } from './contexts/UIContext';
import { PostsProvider } from './contexts/PostsContext';
import { UserProvider } from './contexts/UserContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <AppProvider>
            <UserProvider>
              <PostsProvider>
                <AITutorProvider>
                  <App />
                </AITutorProvider>
              </PostsProvider>
            </UserProvider>
          </AppProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);