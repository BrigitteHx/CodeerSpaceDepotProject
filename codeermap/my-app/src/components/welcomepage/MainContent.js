import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Style/MainContent.css';
import RedirectButtons from './RedirectButtons';

const MainContent = () => {
  const navigate = useNavigate();

  return (
    <main className="main-content">
      <h1>Welcome to Solar Panel Simulation</h1>
      <h2>Your partner in Sustainable Energy Solutions</h2>
      <p>
        Quo mollitia libero id quos eaque a soluta voluptatem aut maiores rerum vel officia debitis et facere minus! Ut pariatur expedita At molestiae natus sed Quis laboriosam et esse voluptas. Non magnam impedit et consequatur explicabo ut ipsam pariatur aut reiciendis iure non totam aspernatur eum dolores velit vel nihil animi.
      </p>

      <div className="buttons">
        <RedirectButtons />
      </div>
    </main>
  );
};

export default MainContent;
