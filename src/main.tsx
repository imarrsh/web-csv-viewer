import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DialogProvider } from './components/Dialog/context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<DialogProvider>
			<App />
		</DialogProvider>
	</React.StrictMode>,
);
