import { useEffect, useState } from 'react';

const useOnScreen = (ref) => {
	const [isIntersecting, setIntersecting] = useState(false);
	const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

	useEffect(() => {
		if (ref.current) {
			observer.observe(ref.current);
			// Remove the observer as soon as the component is unmounted
			return () => {
				observer.disconnect();
			};
		}
	}, [ref.current]);

	return isIntersecting;
};
export default useOnScreen;
