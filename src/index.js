import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NotificationsProvider } from '@mantine/notifications';

//redux stuff
import Masterducer from './redux/reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as actionCreators from './redux/actions';

const store = createStore(
	Masterducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ actionCreators })
);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<NotificationsProvider>
				<App />
			</NotificationsProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
