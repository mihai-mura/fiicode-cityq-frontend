import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';
import UserSettings from './pages/UserSettings/UserSettings';
import Explore from './pages/Explore/Explore';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Authentification from './components/Authentification/Authentification';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedUser, setLanguage } from './redux/actions';
import CreatePostModal from './components/CreatePostModal/CreatePostModal';
import MobileSidebar from './components/MobileSidebar/MobileSidebar';

function App() {
	const toggleMobileMenu = () => {
		setmobileSidebarOpen(!mobileSidebarOpen);
	};
	const [mobileSidebarOpen, setmobileSidebarOpen] = useState(false);
	const loggedUser = useSelector((state) => state.loggedUser);
	const dispatch = useDispatch();
	//*inits
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

	useEffect(() => {
		if (localStorage.getItem('language')) dispatch(setLanguage(localStorage.getItem('language')));
	}, [dispatch]);

	return (
		<div className='App'>
			<Router>
				<Authentification />
				<CreatePostModal />
				<Sidebar />
				<MobileSidebar mobileSidebarOpen={mobileSidebarOpen} toggleMobileMenu={toggleMobileMenu} />
				<div className='main'>
					<Navbar toggleMobileMenu={toggleMobileMenu} />

					<Routes>
						<Route path='/' element={<Explore />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/users' element={<Users />} />
						<Route path='/settings' element={<UserSettings />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
