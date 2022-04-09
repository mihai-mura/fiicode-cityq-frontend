import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Explore from './pages/Explore/Explore';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Authentification from './components/Authentification/Authentification';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedUser } from './redux/actions';

function App() {
	const loggedUser = useSelector((state) => state.loggedUser);
	const dispatch = useDispatch();
	//setLoggedUser
	useEffect(() => {
		(async () => {
			if (localStorage.getItem('api-token') && !loggedUser) {
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
				});
				const user = await res.json();
				if (res.status === 200) {
					dispatch(setLoggedUser(user));
					if (user.success) {
						return user.data;
					}
				}
			}
		})();
	}, [dispatch, loggedUser]);

	return (
		<div className='App'>
			<Router>
				<Authentification />
				<Sidebar />
				<div className='main'>
					<Navbar />

					<Routes>
						<Route path='/' element={<Explore />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/users' element={<Users />} />
						<Route path='/settings' element={<Settings />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
