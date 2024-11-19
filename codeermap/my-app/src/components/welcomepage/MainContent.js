import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/MainContent.css';
import RedirectButtons from './RedirectButtons';

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className='main-content'>
          <h1>Welcome to the Solar Panel Simulator!</h1>
          <h2>Your Partner in Sustainable Energy Solutions</h2>
          <p>
            Are you curious about how to optimize your energy consumption and storage with a home battery? This simulator helps you gain insight into how a home battery can work in your situation and offers the ability to try out different scenarios. By simulating your daily energy consumption, solar panel output, and battery capacity, you can discover when it’s smart to charge or discharge your battery.
          </p>

        <p>
          With this tool, you can:
        </p>
        <ul>
          <li><strong>Create customized simulations</strong> by adjusting battery settings to fit your personal situation and preferences.</li>
          <li><strong>Gain insights</strong> into the costs and benefits of different charging and discharging strategies, so you can determine the most advantageous approach for you.</li>
          <li><strong>Optimize</strong> by varying parameters such as the number of solar panels and energy prices.</li>
        </ul>

        <p>
          You can save your results by creating an account through the registration option, or log in to revisit and adjust your previous simulations. Make sure to look at the buttons below!
        </p>
        <p>
          Whether you want to save on energy costs, reduce your reliance on the grid, or simply explore the possibilities of a home battery—this simulator is here to help you. Start now and discover how you can improve your energy management!
        </p>

        <div className="buttons">
          <RedirectButtons />
        </div>
      </div>

    </main>
  );
};

export default MainContent;