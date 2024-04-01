<template>
  <div class="centered-container">
    <div v-if="!isLoggedIn" class="registration-form">
      <h1>Registration</h1>
      <input type="text" v-model="username" placeholder="Username" class="input-field">
      <br>
      <input type="password" v-model="password" placeholder="Password" class="input-field">
      <br>
      <button @click="register" class="register-button">Registration</button>
      <a href="/login" class="create-account-link">Log In</a>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button @click="showPrivacyPolicy" class="privacy-policy-button">View Data Privacy Policy</button>
      <div v-if="showPrivacy" class="privacy-policy">
        <span class="close" @click="closePrivacyPolicy">&times;</span>
        <h2>Data Privacy Policy</h2>
        <h3>Introduction</h3>
        <p>This Privacy Policy describes how LetsWatch ("we," "us," or "our") collects, uses, and discloses your
          personal information when you use our web application (the "App").</p>
        <h3>Information We Collect</h3>
       <ul>
          <li><strong>Username:</strong> You provide your username when you register for an account on the App. We store
            usernames in plain text.</li>
          <li><strong>Password:</strong> You create a password when you register for an account on the App. We store
            passwords using a strong, one-way encryption algorithm. This means we cannot decrypt your password back to
            its original form, but we can verify it when you log in.</li>
        </ul>
        <h3>Information We Collect Through Technology</h3>
        <h4>Session Data</h4>
        <p>We use session storage in your browser to store temporary data while you are actively using the
          App. This data is typically cleared when you close your browser window and does not include personally
          identifiable information.</p>
        <h3>How We Use Your Information</h3>
        <ul>
          <li>Provide and operate the App</li>
          <li>Process your registration and manage your account</li>
          <li>Identify you when you log in to the App</li>
          <li>Respond to your inquiries and requests</li>
        </ul>
        <h3>Information Sharing and Disclosure</h3>
        <p>We do not share or sell your personal information to third parties. We may disclose your information if
          required by law or in the good faith belief that such disclosure is necessary to:</p>
        <ul>
          <li>Comply with a legal obligation</li>
          <li>Protect the rights or safety of you, another user, or the public</li>
          <li>Prevent or investigate fraud or other unlawful activity</li>
        </ul>

        <h3>Data Security</h3>

        <p>We take reasonable precautions to protect your personal information from unauthorized access, disclosure,
          alteration, or destruction. However, no internet transmission or electronic storage method is completely
          secure. Therefore, we cannot guarantee absolute security.</p>

        <h3>Contact Us</h3>

        <p>If you have any questions about this Privacy Policy, please create an issue on the project's repository:
          <a href="https://github.com/EmerickGrimm/letsWatch">[link to repository].</a></p>
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
    async register() {
      this.error = null;

      if (!this.username || this.username.length < 3) {
        this.error = "Username must be at least 3 characters long.";
        return;
      }

      if (!this.password || this.password.length < 8) {
        this.error = "Password must be at least 8 characters long.";
        return;
      }

      this.username = DOMPurify.sanitize(this.username);
      this.password = DOMPurify.sanitize(this.password);

      if (this.isPotentialAttack()) {
        this.error = "Nuh Uh (¬‿¬ )";
        return;
      }

      try {
        const response = await AuthenticationService.register({
          username: this.username,
          password: this.password
        });

        if (response.status === 200) {
          sessionStorage.setItem('userToken', response.data.token);
          this.successMessage = "Registration successful!";
          this.username = '';
          this.password = '';
          this.$router.push('/');
        } else {
          this.error = "Registration failed. Please try again.";
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
  max-width: 90%; 
  max-height: 90%; 
  overflow-y: auto; 
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
