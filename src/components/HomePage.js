import React from 'react';
import {Link} from 'react-router';

const HomePage = () => {
  return (
    <div>
      <ol>
        <li><Link to="login">login</Link></li>
        <li>Review the <Link to="users">Users List</Link></li>
      </ol>
    </div>
  );
};

export default HomePage;
