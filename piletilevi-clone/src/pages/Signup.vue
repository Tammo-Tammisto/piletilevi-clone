<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const message = ref('');

const signup = async () => {
    const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to Home page
        router.push('/');
    } else {
        message.value = 'Signup failed: ' + data.error;
    }
};
</script>

<template>
    <div class="signup-container">
        <h1>Signup</h1>
        <input v-model="firstName" type="text" placeholder="First Name" class="input" />
        <input v-model="lastName" type="text" placeholder="Last Name" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />
        <button @click="signup" class="button">Sign Up</button>
        <p>{{ message }}</p>
        <br>
        <router-link to="/login">Already have an account? Log in here</router-link>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.signup-container {
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