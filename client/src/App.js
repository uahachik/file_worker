import React, { Suspense } from 'react';
import './App.css';

import Worker from './components/Worker';
import User from './components/User';
import { createResource } from './components/UserApi';

const resourse = createResource();

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <Worker />

        <Suspense fallback={<h1>Loading...</h1>}>
          <User resourse={resourse} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
