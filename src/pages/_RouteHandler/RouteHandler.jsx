import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeModalState } from '../../redux/actions';
import LANGUAGE from '../../utils/languages.json';

const RouteHandler = ({ children, allow, logged }) => {
	const dispatch = useDispatch();
	const selectedLanguage = useSelector((state) => state.language);
	const loggedUser = useSelector((store) => store.loggedUser);

	const [content, setContent] = useState(children);

	const AccessDenied = (
		<div className='page' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
			{LANGUAGE.access_denied_page[selectedLanguage]}
		</div>
	);

	useEffect(() => {
		if (logged && !localStorage.getItem('api-token') && !loggedUser) {
			setContent(null);
			dispatch(changeModalState('login', true));
		} else {
			dispatch(changeModalState('login', false));
			setContent(children);
			if (allow !== loggedUser?.role && allow) {
				setContent(AccessDenied);
			}
		}
	}, [allow, children, dispatch, logged, loggedUser]);

	return content;
};
export default RouteHandler;
