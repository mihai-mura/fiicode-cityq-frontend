import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSettings from './pages/UserSettings/UserSettings';
import Explore from './pages/Explore/Explore';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Authentification from './components/_Modals/Authentification/Authentification';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedUser, setLanguage } from './redux/actions';
import CreatePostModal from './components/_Modals/CreatePostModal/CreatePostModal';
import MobileSidebar from './components/MobileSidebar/MobileSidebar';
import RestorePassword from './pages/RestorePassword/RestorePassword';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import CreateAdminModal from './components/_Modals/CreateAdminModal/CreateAdminModal';
import ROLE from './utils/roles';
import { LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { errorNotification } from './components/Notifications/Notifications';
import CreateModeratorModal from './components/_Modals/CreateModeratorModal/CreateModeratorModal';
import AddressVerification from './pages/AddressVerification/AddressVerification';
import PostRequests from './pages/PostRequests/PostRequests';
import PostPage from './pages/PostPage/PostPage';
import UpdatePostStatusModal from './components/_Modals/UpdatePostStatusModal/UpdatePostStatusModal';
import RouteHandler from './pages/_RouteHandler/RouteHandler';
import MyPosts from './pages/MyPosts/MyPosts';
import EditPostModal from './components/_Modals/EditPostModal/EditPostModal';
import PostVerification from './pages/PostVerification/PostVerification';
import Favourites from './pages/Favourites/Favourites';

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
				<UpdatePostStatusModal />
				<EditPostModal />

				<Sidebar />
				<MobileSidebar
					mobileSidebarOpen={mobileSidebarOpen}
					toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)}
				/>
				<div className='main'>
					<Navbar toggleMobileMenu={() => setmobileSidebarOpen(!mobileSidebarOpen)} />

					<Routes>
						<Route path='/' element={<Explore />} />
						<Route path='/post/:id' element={<PostPage />} />
						<Route path='/recover-password/:token' element={<RestorePassword />} />
						<Route
							path='/my-posts'
							element={
								<RouteHandler logged>
									<MyPosts />
								</RouteHandler>
							}
						/>
						<Route
							path='/favourites'
							element={
								<RouteHandler logged>
									<Favourites />
								</RouteHandler>
							}
						/>
						<Route
							path='/settings'
							element={
								<RouteHandler logged>
									<UserSettings role={ROLE.USER} />
								</RouteHandler>
							}
						/>
						{/* moderator routes */}
						<Route
							path='/moderator'
							element={
								<RouteHandler logged>
									<PostVerification />
								</RouteHandler>
							}
						/>
						<Route
							path='/moderator/settings'
							element={
								<RouteHandler logged>
									<UserSettings role={ROLE.MODERATOR} />
								</RouteHandler>
							}
						/>
						{/* local admin routes */}
						<Route
							path='/local-admin/requests'
							element={
								<RouteHandler allow={ROLE.LOCAL_ADMIN} logged>
									<PostRequests />
								</RouteHandler>
							}
						/>
						<Route
							path='/local-admin/address-verification'
							element={
								<RouteHandler allow={ROLE.LOCAL_ADMIN} logged>
									<AddressVerification />
								</RouteHandler>
							}
						/>
						<Route
							path='/local-admin/moderators'
							element={
								<RouteHandler allow={ROLE.LOCAL_ADMIN} logged>
									<ManageUsers target={ROLE.MODERATOR} />
								</RouteHandler>
							}
						/>
						<Route
							path='/local-admin/settings'
							element={
								<RouteHandler logged>
									<UserSettings role={ROLE.LOCAL_ADMIN} />
								</RouteHandler>
							}
						/>
						{/* general admin routes */}
						<Route
							path='/general-admin'
							element={
								<RouteHandler allow={ROLE.GENERAL_ADMIN} logged>
									<ManageUsers target={ROLE.LOCAL_ADMIN} />
								</RouteHandler>
							}
						/>
						<Route
							path='/general-admin/settings'
							element={
								<RouteHandler logged>
									<UserSettings role={ROLE.GENERAL_ADMIN} />
								</RouteHandler>
							}
						/>
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
