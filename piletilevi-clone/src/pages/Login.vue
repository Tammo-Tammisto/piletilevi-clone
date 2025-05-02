<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const message = ref('');

const login = async () => {
    const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to Home page
        window.location.href = '/';
    } else {
        message.value = 'Login failed: ' + data.message;
    }
};
</script>

<template>
    <div class="login-container">
        <h1>Login</h1>
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <button @click="login" class="button">Log In</button>
        <p>{{ message }}</p>
        <br>
        <router-link to="/signup">Don't have an account? Register here</router-link>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
}

.input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.button {
    width: 100%;
    padding: 10px;
    background: blue;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>