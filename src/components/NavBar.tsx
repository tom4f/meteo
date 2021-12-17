import { NavLink, Outlet } from 'react-router-dom';

import navBarStyle from './../css/NavBar.module.scss'

const activeStyle = (navData: { isActive:boolean }) => (navData.isActive ? navBarStyle.active : '')

export const NavBar = () => {
  return (
    <header className={navBarStyle.header}>
      <nav>

            <NavLink className={ navData => activeStyle(navData) } to='frymburk' >
               Meteo Frymburk
            </NavLink>


            <NavLink className={ navData => activeStyle(navData) } to='lipno' >
              Meteo Lipno
            </NavLink>


            <NavLink className={ navData => activeStyle(navData) } to='oldStation' >
              Meteo původní
            </NavLink>

      </nav>
    </header>
  );
};

export const NavBarDavis = () => {
  return (
    <>
      <header className={navBarStyle.header}>
        <nav>

              <NavLink className={ navData => activeStyle(navData) } to='week' >
                Týden
              </NavLink>


              <NavLink className={ navData => activeStyle(navData) } to='year' >
                od roku 2021
              </NavLink>


              <NavLink className={ navData => activeStyle(navData) } to='table' >
                tabulka
              </NavLink>


              <NavLink className={ navData => activeStyle(navData) } to='statistics' >
                statistiky
              </NavLink>

        </nav>
      </header>
      <Outlet/>
    </>
  );
};

export const NavBarLipno = () => {
  return (
    <>
      <header className={navBarStyle.header}>
        <nav>

              <NavLink className={ navData => activeStyle(navData) } to='graphs' >
                grafy od roku 2000
              </NavLink>


              <NavLink className={ navData => activeStyle(navData) } to='table' >
                tabulka
              </NavLink>

        </nav>
      </header>
      <Outlet/>
    </>
  );
};

export const NavBarOldStation = () => {
  return (
    <>
      <header className={navBarStyle.header}>
        <nav>

              <NavLink className={ navData => activeStyle(navData) } to='graphs' >
                grafy od roku 2000
              </NavLink>


              <NavLink className={ navData => activeStyle(navData) } to='table' >
                tabulka
              </NavLink>

        </nav>
      </header>
      <Outlet/>
    </>
  );
};