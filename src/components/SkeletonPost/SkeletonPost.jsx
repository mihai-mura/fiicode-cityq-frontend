import { Skeleton } from '@mantine/core';

const SkeletonPost = (props) => {
	return (
		<div className='post-container' ref={props.lastElementRef}>
			<div className='post-header'>
				<div style={{ width: '90px', height: '100%' }}>
					<Skeleton height={10} radius='xl' width='100%' />
					<Skeleton height={10} radius='xl' mt={5} width='80%' />
				</div>
			</div>
			<div className='post-carousel-container'>
				<Skeleton height='100%' radius='lg' width='100%' />
			</div>
			<div className='post-title'>
				<Skeleton height={10} radius='xl' width='40%' />
			</div>
			<div className='post-description'>
				<Skeleton height={10} radius='xl' width='80%' />
				<Skeleton height={10} radius='xl' mt={5} width='80%' />
				<Skeleton height={10} radius='xl' mt={5} width='80%' />
			</div>
			<div className='post-footer' style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Skeleton height={10} radius='xl' width='20%' />
				<Skeleton height={10} radius='xl' width='10%' />
			</div>
		</div>
	);
};
export default SkeletonPost;
