import React, { useState } from 'react';
// import PropTypes from 'prop-types';

const Worker = () => {
  const [file, setFile] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  const [isErrors, setIsErrors] = useState(false);

  const onChange = e => {
    const file = e.target.files[0];

    //check extension on front-end
    // const ext = file.name.split('.').pop();
    // if (ext !== 'csv') {
    //   return console.log('only CSV extension file allowed');
    // }

    setIsErrors(false);
    setFile(file);
    setIsUpload(false);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!file) {
      return console.log('please choose a file');
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:9000/api/workers/upload', {
      method: 'post',
      body: formData
    }).then(data => {
      data.json().then(data => {
        if (data.errors) {
          var { errors } = data;
        }

        if (Array.isArray(errors)) {
          setIsErrors(true);
          return errors.forEach(error => console.log(error));
        } else if (errors && !Array.isArray(errors)) {
          console.log(errors);
          setIsErrors(true);
          return errors;
        }
        setIsErrors(false);
        setIsUpload(true);
        console.log(data);
      });
    });
  };

  return (
    <div>
      <div style={{ width: '200px', marginTop: '20px' }}></div>
      <form
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        onSubmit={onSubmit}
      >
        <label
          htmlFor="file"
          style={{
            marginRight: '15px',
            color: 'mediumspringgreen',
            border: 'white solid 1px',
            padding: '3px 9px'
          }}
        >
          {file ? 'Choose another file' : 'Choose a file'}
        </label>
        <input
          type="file"
          name="file"
          id="file"
          style={{ display: 'none' }}
          onChange={onChange}
        />

        {!isUpload && file && (
          <input
            type="submit"
            value={
              !isErrors
                ? '   Upload current   '
                : 'Upload or Fix current errors'
            }
            style={{
              padding: '10px 20px 3px 20px',
              fontWeight: 'bold',
              color: 'darkred'
            }}
          />
        )}
      </form>
    </div>
  );
};

// Worker.propTypes = {};

export default Worker;
