import React from 'react';
import './MobileSidebar.scss';
import { motion } from 'framer-motion';

const MobileSidebar = ({ mobileSidebarOpen, toggleMobileMenu }) => {
	return (
		<div
			style={{ opacity: mobileSidebarOpen ? '100%' : '0', left: mobileSidebarOpen ? '0' : '-100%' }}
			className='mobilesidebar-container'>
			<div className='mobilesidebar-logo'>MobileSidebar</div>
			<div className='mobilesidebar-button' onClick={toggleMobileMenu}>
				back
			</div>
		</div>
	);
};

export default MobileSidebar;
