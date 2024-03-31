<template>
    <div class="centered-container">
      <div class="registration-form">
        <h1>Hi There</h1>
      </div>
    </div>
  </template>
  <script>
  import AuthenticationService from '@/services/AuthenticationService'
  
  export default {
    data () {
      return {
      }
    },
  }
  </script>
  
  <style scoped>
  
  .registration-form {
    width: 300px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f2f2f2;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .register-button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    background-color: #E1AFD1;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  .register-button:hover {
    background-color: #AD88C6;
  }
  
  .error-message {
    color: #EE4266;
    font-size: 14px;
    margin-top: 5px;
  }
  </style>
  