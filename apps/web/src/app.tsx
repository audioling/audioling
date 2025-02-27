import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import '/@/styles/global.css';
import '/@/styles/mantine-theme.css';
import { AppProvider } from '/@/app-provider';

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <AppProvider />
    </React.StrictMode>,
);
