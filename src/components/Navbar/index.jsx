import React from 'react'
import './Navbar.scss';
import profile from '../../images/logo.png'
import { GoSearch } from 'react-icons/go';

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <header>
              <img src={profile} alt="logo"/>
              <div className="name">Mihai</div>
        </header>
        <div className="search">
          <GoSearch className="search-icon"></GoSearch>
          <input className="search-input" type="search" placeholder="Keyword"/>
        </div>

        
      </div>
      
    </>
  )
}

export default Navbar