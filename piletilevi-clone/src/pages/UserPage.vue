<template>
    <div id="account-info">
        <h1>User Page</h1>
        <p>First Name: {{ firstName }}</p>
        <p>Last Name: {{ lastName }}</p>
        <p>Email: {{ email }}</p>
        <p>Account Created: {{ created_at }}</p>
    </div>
    <div>
        <h1>My tickets</h1>
        <p>Tickets will be added later</p>
    </div>

    <button @click="logOut"
        class="w-full p-3 mb-4 bg-blue-500 rounded-lg text-white font-semibold shadow-lg hover:bg-blue-600">Log
        out</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem("user"));
const userID = user ? user.id : null;

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const created_at = ref('');
//const tickets = ref([]);    Tickets will be added later

const fetchData = async () => {
    if (!userID) {
        console.error('User ID not found in localStorage');
        return;
    }
    console.log('Fetching user data for userID:', userID);


    try {
        const response = await axios.get(`http://localhost:3000/user/${userID}`);
        const userInfo = response.data;
        console.log('User info:', userInfo);

        if (userInfo) {
            firstName.value = userInfo.first_name;
            lastName.value = userInfo.last_name;
            email.value = userInfo.email;
            created_at.value = userInfo.created_at;
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
onMounted(() => {
    fetchData();
    //fetchTickets();       Tickets will be added later
});

function logOut() {
    localStorage.removeItem("user");
    window.location.href = "/login";
}
</script>