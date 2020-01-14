import React from 'react';
import PropTypes from 'prop-types';

const User = ({ resourse }) => {
  const users = resourse.user.read();

  return (
    <div>
      {users.map(user => {
        const { _id, user_name, first_name, last_name } = user;
        return (
          <div key={_id}>
            <h4>
              <span style={{ color: 'cadetblue' }}> User name</span> {user_name}
              ,<span style={{ color: 'cadetblue' }}> Full name</span>{' '}
              {first_name} {last_name}
            </h4>
          </div>
        );
      })}
    </div>
  );
};

User.propTypes = {
  resourse: PropTypes.object.isRequired
};

export default User;
