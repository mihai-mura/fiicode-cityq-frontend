import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
	return (
		<div className='App'>
			<Router>
				<Sidebar />
				<h2>mihai te iubesc</h2>
				<Routes>
					<Route path='/' element={<Explore />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/users' element={<Users />} />
					<Route path='/settings' element={<Settings />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
