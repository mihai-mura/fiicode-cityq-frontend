import { showNotification } from '@mantine/notifications';
import { errorNotification } from '../../components/Notifications/Notifications';
import { useEffect, useState } from 'react';
import AddressVerificationCard from '../../components/AddressVerificationCard/AddressVerificationCard';
import './AddressVerification.scss';
import EmptyStatePlaceholder from '../../components/EmptyStatePlaceholder/EmptyStatePlaceholder';
import { LoadingOverlay } from '@mantine/core';
import { useSelector } from 'react-redux';

const AddressVerification = () => {
	const loggedUser = useSelector((state) => state.loggedUser);

	const [users, setUsers] = useState([]);
	const [loadingOverlay, setLoadingOverlay] = useState(false);

	//set unverified users
	useEffect(() => {
		(async () => {
			setLoadingOverlay(true);
			const res = await fetch(`${process.env.REACT_APP_API_URL}/users/unverified`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('api-token')}`,
				},
			});
			if (res.status === 200) {
				const users = await res.json();
				setUsers(users);
			} else {
				showNotification(errorNotification());
			}
			setLoadingOverlay(false);
		})();
	}, []);

	return (
		<div className='page page-address-verification'>
			<LoadingOverlay visible={loadingOverlay} />
			<div className='page-header'>
				{/* //! somewhere to show what city is the admin managing */}
				<p>{loggedUser?.city}</p>
				<h4>{`${users.length} new requests`}</h4>
			</div>
			<div className='body'>
				{users.map((user, index) => (
					<AddressVerificationCard
						key={index}
						_id={user._id}
						firstName={user.first_name}
						lastName={user.last_name}
						email={user.email}
						address={user.address.name}
						idImg={user.address.id_url}
						profileImg={user.profile_pic_url}
						deleteCard={() => setUsers((prev) => prev.filter((u) => u._id !== user._id))}
					/>
				))}
				{users.length === 0 && <EmptyStatePlaceholder text='No requests yet!' />}
			</div>
		</div>
	);
};
export default AddressVerification;
