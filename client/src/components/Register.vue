<template>
  <div class="centered-container">
    <div class="registration-form">
      <h1>Register</h1>
      <input type="text" name="username" v-model="username" placeholder="Username" class="input-field">
      <br>
      <input type="password" name="password" v-model="password" placeholder="Password" class="input-field">
      <br>
      <button @click="register" class="register-button">Register</button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'

export default {
  data () {
    return {
      username: '',
      password: '',
      error: null,
      successMessage: null
    }
  },
  methods: {
    async register () {
      // Reset error message
      this.error = null;

      // Check username
      if (!this.username || this.username.length < 3) {
        this.error = "Username must be at least 3 characters long.";
        return;
      }

      // Check password
      if (!this.password || this.password.length < 8) {
        this.error = "Password must be at least 8 characters long.";
        return;
      }

      try {
        const response = await AuthenticationService.register({
          username: this.username,
          password: this.password
        });

        // Check if registration was successful
        if (response.status === 200) {
          // Set success message
          this.successMessage = "Registration successful!";
          // Reset username and password fields
          this.username = '';
          this.password = '';
        } else {
          // Handle unsuccessful registration
          this.error = "Registration failed. Please try again.";
        }
      } catch (error) {
        // Handle registration error
        this.error = error.response.data.error;
      }
    }
  }
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

.success-message {
  color: #34a853;
  font-size: 14px;
  margin-top: 5px;
}
</style>
