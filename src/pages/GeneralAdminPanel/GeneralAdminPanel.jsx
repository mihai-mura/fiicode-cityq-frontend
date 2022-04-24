import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ROLE from '../../utils/roles';

const AccessDenied = <h1>Access Denied</h1>;

const GeneralAdminPanel = () => {
	const loggedUser = useSelector((state) => state.loggedUser);

	const [pageContent, setPageContent] = useState(null);

	useEffect(() => {
		if (!loggedUser) {
			setPageContent(AccessDenied);
		}
		if (loggedUser?.role !== ROLE.GENERAL_ADMIN) {
			setPageContent(AccessDenied);
		}
		if (loggedUser?.role === ROLE.GENERAL_ADMIN) {
			setPageContent(<h1>General Admin Panel</h1>);
		}
	}, [loggedUser]);

	return <div className='page'>{pageContent}</div>;
};
export default GeneralAdminPanel;
