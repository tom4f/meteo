import { NavLink, Outlet } from 'react-router-dom';

import navBarStyle from './../css/NavBar.module.scss'

export const NavBar = () => {
  return (
    
    <header className={navBarStyle.header}>
      <nav>
        <ul>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='frymburk'
            >
               Meteostanice Frymburk
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='lipno'
            >
              Lipno u hráze
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='oldStation'
            >
              Původní meteostanice
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>

  );
};

export const NavBarDavis = () => {
  return (
    <>
    <header className={navBarStyle.header}>
      <nav>
        <ul>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='week'
            >
              Týden
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='year'
            >
              Od roku 2021
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='table'
            >
              tabulka
            </NavLink>
          </li>
          <li>
            <NavLink
              className={(navData) => (navData.isActive ? navBarStyle.active : '')}
              to='statistics'
            >
              statistiky
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
        <Outlet/>
        </>
  );
};