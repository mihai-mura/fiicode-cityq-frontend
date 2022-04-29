import EmptyState from '../../images/empty-state.png';
import EmptySearch from '../../images/empty-search.png';

const EmptyStatePlaceholder = (props) => {
	//* put pos relative on the element to make it center
	return (
		<div
			style={{
				width: 'fit-content',
				height: 'fit-content',
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '10px',
			}}>
			<img style={{ width: '200px' }} src={props.search ? EmptySearch : EmptyState} alt='empty state' />
			<p style={{ fontSize: '1.3rem' }}>{props.text}</p>
		</div>
	);
};
export default EmptyStatePlaceholder;
