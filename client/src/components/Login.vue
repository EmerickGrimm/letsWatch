<template>
  <div class="centered-container">
    <div v-if="!isLoggedIn" class="registration-form">
      <h1>Log In</h1>
      <input type="text" v-model="username" placeholder="Username" class="input-field">
      <br>
      <input type="password" v-model="password" placeholder="Password" class="input-field">
      <br>
      <button @click="login" class="register-button">Log In</button>
      <a href="/register" class="create-account-link">Create Account</a>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button @click="showPrivacyPolicy" class="privacy-policy-button">View Data Privacy Policy</button>
      <div v-if="showPrivacy" class="privacy-policy">
        <span class="close" @click="closePrivacyPolicy">&times;</span>
        <h2>Data Privacy Policy</h2>
        <p>{{ privacyPolicyText }}</p>
      </div>
    </div>
    <div v-else>
      <p>You are already logged in.</p>
      this.$router.push('/');
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
      isLoggedIn: false,
      showPrivacy: false,
      privacyPolicyText: `This is the privacy policy text.`
    }
  },
  async created() {
    try {
      const token = sessionStorage.getItem('userToken');
      if (token) {
        const response = await AuthenticationService.checkLoginStatus();
        if (response.status === 200) {
          this.isLoggedIn = true;
          this.$router.push('/');
        } else {
          sessionStorage.clear();
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  },
  methods: {
    async login() {
      this.error = null;

      if (!this.username) {
        this.error = "Username is required!";
        return;
      }

      if (!this.password) {
        this.error = "Username is required!";
        return;
      }

      this.username = DOMPurify.sanitize(this.username);
      this.password = DOMPurify.sanitize(this.password);

      if (this.isPotentialAttack()) {
        this.error = "Nuh Uh (¬‿¬ )";
        return;
      }

      try {
        const response = await AuthenticationService.login({
          username: this.username,
          password: this.password
        });

        if (response.status === 200) {
          sessionStorage.setItem('userToken', response.data.token);
          this.successMessage = "Logged In successful!";
          this.username = '';
          this.password = '';
          this.$router.push('/');
        } else {
          this.error = "Failed. Please try again.";
        }
      } catch (error) {
        this.error = error.response.data.error;
      }
    },
    isPotentialAttack() {
      const regex = /[<>!@#$%^&*(),?":{}|<>]/;
      return regex.test(this.username) || regex.test(this.password);
    },
    showPrivacyPolicy() {
      this.showPrivacy = true;
    },
    closePrivacyPolicy() {
      this.showPrivacy = false;
    }
  }
}
</script>

<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.registration-form {
  width: 300px;
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

.privacy-policy-button {
  width: 75%;
  padding: 8px; 
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  background-color: #B08BBB;
  color: white;
  font-size: 14px; 
  cursor: pointer;
}

.register-button{
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

.create-account-link {
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #8B93FF;
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

.privacy-policy {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
