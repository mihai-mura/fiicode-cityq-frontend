import {motion} from "framer-motion";
import {NavLink} from 'react-router-dom';
import {MdOutlineExplore , MdOutlineDashboardCustomize} from 'react-icons/md'
import {AiOutlineUser} from 'react-icons/ai'
import {FiSettings} from 'react-icons/fi'
import {MdOutlineKeyboardArrowLeft} from 'react-icons/md'
import {MdOutlineKeyboardArrowRight} from 'react-icons/md'
import AtlasLogo from '../images/logo-atlas.svg'
import './Sidebar.scss';
import {useState} from 'react';


const routes = [
  {
    path:"/",
    name:"Explore",
    icon: <MdOutlineExplore />
  },
  {
    path:"/dashboard",
    name:"Dashboard",
    icon: <MdOutlineDashboardCustomize />
  },
  {
    path:"/users",
    name:"Users",
    icon: <AiOutlineUser />
  },
  {
    path:"/settings",
    name:"Settings",
    icon: <FiSettings />
  }

]

const Sidebar = ({children}) => {

  const [isOpen,setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="main-container">
      <motion.div animate={{width: isOpen ? "250px": "90px"}} className="sidebar">

        <div className="top-section">
        <NavLink to="/"><img src={AtlasLogo} alt="logo" to="/"/></NavLink>
        {isOpen && <h3 className="logo-name">atlas</h3>}
      
        {isOpen ? <div className="arrow"><MdOutlineKeyboardArrowLeft onClick={toggle}/></div> : <div className="arrow"><MdOutlineKeyboardArrowRight onClick={toggle}/></div> }
        
        </div>
        <section className="routes">
           {routes.map((route) =>
            <NavLink to={route.path} key={route.name} className="link">
              <div className="icon">{route.icon}</div>
              {isOpen && <div className="link_text">{route.name}</div>}
            </NavLink>
           )} 
        </section>
      </motion.div>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Sidebar