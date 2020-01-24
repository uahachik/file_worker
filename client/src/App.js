import React, { Suspense, useState, useEffect } from 'react';
import './App.css';

import Worker from './components/Worker';
import User from './components/User';
import { createResource } from './components/UserApi';

const resourse = createResource();

function App() {
  const [data, setData] = useState('');

  // useEffect(() => {
  //   fetch('http://localhost:9000')
  //     .then(data => data.json())
  //     .then(data => console.log(data));
  //   // .then(data => setData(data.usersCount))
  // }, []);
  return (
    <div className="App">
      <div className="App-container">
        <Worker />
        {data}
        <Suspense fallback={<h1>Loading...</h1>}>
          <User resourse={resourse} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
