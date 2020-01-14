const fetchUsers = async () => {
  return fetch('http://localhost:9000/api/users').then(user =>
    user.json().then(user => user.reverse())
  );
};

const wrapPromise = promise => {
  let status = 'pending';
  let result = '';
  let suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      }

      return result;
    }
  };
};

export const createResource = () => {
  return {
    user: wrapPromise(fetchUsers())
  };
};
