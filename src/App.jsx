import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Authentification from './components/Authentification/Authentification';

function App() {
	return (
		<div className='App'>
			<Router>
				{/*//! plug redux */}
				<Authentification open={null} close={null} type={0} /> {/*1 register | 0 login */}
				<Sidebar />
				<div className='main'>
					<Navbar />
					<Routes>
						<Route path='/' element={<Explore />} />
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
