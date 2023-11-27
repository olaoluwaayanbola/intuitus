// MenuBar.js
import {useState} from 'react';


const MenuBar = () => {
  const [dropdown,setdropdown] = useState<boolean>(true)
  return (
    <nav className="menu-bar">
      <div className="logo">
        <h1>DataViz App</h1>
      </div>
      <ul className="menu-items">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#dashboard">Dashboard</a>
        </li>
        <li className="dropdown">
          <a href="#visualizations" onClick={() => {
              setdropdown(pre => !pre)
          }}>Visualizations</a>
          {         
              dropdown &&
                <div className="dropdown-content"  >
                  <a href="#type1">Type 1</a>
                  <a href="#type2">Type 2</a>
                  <a href="#type3">Type 3</a>
                </div>
          }
        </li>
        <li>
          <a href="#settings">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
