import React from 'react';

const AdminCards = ({ stats }) => {
  return (
    <div className="admin-cards">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <h3>{stat.title}</h3>
          <p>{stat.count}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminCards;
