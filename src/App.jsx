import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
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
import RestorePassword from './pages/RestorePassword/RestorePassword';
import GeneralAdminPanel from './pages/GeneralAdminPanel/GeneralAdminPanel';
import CreateAdminModal from './components/CreateAdminModal/CreateAdminModal';
import ROLE from './utils/roles';
import { LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from './components/Notifications/Notifications';

function App() {
	const [mobileSidebarOpen, setmobileSidebarOpen] = useState(false);
	const loggedUser = useSelector((state) => state.loggedUser);
	const dispatch = useDispatch();
	const [loadingOverlay, setLoadingOverlay] = useState(false);
	//*inits
	//setLoggedUser
	useEffect(() => {
		(async () => {
			if (localStorage.getItem('api-token') && !loggedUser) {
				setLoadingOverlay(true);
				const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('api-token')}`,
					},
				});
				const user = await res.json();
				if (res.status === 200) {
					dispatch(setLoggedUser(user));
					setLoadingOverlay(false);
				} else {
					showNotification(errorNotification());
				}
			}
		})();
	}, [dispatch, loggedUser]);

	useEffect(() => {
		if (localStorage.getItem('language')) dispatch(setLanguage(localStorage.getItem('language')));
	}, [dispatch]);

	return (
		<div className='App'>
			<LoadingOverlay visible={loadingOverlay} loaderProps={{ size: 'xl' }} />
			<Router>
				{/* modals */}
				<Authentification />
				<CreatePostModal />
				<CreateAdminModal />

				<Sidebar />
				<MobileSidebar
					mobileSidebarOpen={mobileSidebarOpen}
					toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)}
				/>
				<div className='main'>
					<Navbar toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)} />

					<Routes>
						<Route path='/' element={<Explore />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/settings' element={<UserSettings target={ROLE.USER} />} />
						<Route path='/recover-password/:token' element={<RestorePassword />} />
						{/* general admin routes */}
						<Route path='/general-admin' element={<GeneralAdminPanel />} />
						<Route path='/general-admin/settings' element={<UserSettings target={ROLE.GENERAL_ADMIN} />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
