import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ManageUsers from './pages/ManageUsers/ManageUsers';
import CreateAdminModal from './components/CreateAdminModal/CreateAdminModal';
import ROLE from './utils/roles';
import { LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from './components/Notifications/Notifications';
import CreateModeratorModal from './components/CreateModeratorModal/CreateModeratorModal';
import AddressVerification from './pages/AddressVerification/AddressVerification';

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
				<CreateModeratorModal />

				<Sidebar />
				<MobileSidebar
					mobileSidebarOpen={mobileSidebarOpen}
					toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)}
				/>
				<div className='main'>
					<Navbar toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)} />

					<Routes>
						<Route path='/' element={<Explore />} />
						<Route path='/settings' element={<UserSettings target={ROLE.USER} />} />
						<Route path='/recover-password/:token' element={<RestorePassword />} />
						{/* general admin routes */}
						<Route path='/general-admin' element={<ManageUsers target={ROLE.LOCAL_ADMIN} />} />
						<Route path='/general-admin/settings' element={<UserSettings role={ROLE.GENERAL_ADMIN} />} />
						{/* local admin routes */}
						<Route path='/local-admin/address-verification' element={<AddressVerification />} />
						<Route path='/local-admin/moderators' element={<ManageUsers target={ROLE.MODERATOR} />} />
						<Route path='/local-admin/settings' element={<UserSettings role={ROLE.LOCAL_ADMIN} />} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
