<script setup>
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(router.getRoutes());
</script>

<template>
    <div class="navbar">
        <div class="navbar-top">
            <a href="/"><img src="./icons/piletilevi.svg" alt="piletilevi logo" class="nav-logo"></a>
            <div class="nav-buttons">
                <a href="/login"><img src="./icons/login.svg" alt="login button" class="nav-icon"></a>
                <a href="/cart"><img src="./icons/cart.svg" alt="cart" class="nav-icon"></a>
            </div>
        </div>

        <div class="tabs">
            <router-link to="/tickets/all">All events</router-link>
            <router-link to="/tickets/music">Music</router-link>
            <router-link to="/tickets/theater">Theater</router-link>
            <router-link to="/tickets/sport">Sport</router-link>
            <router-link to="/tickets/festival">Festival</router-link>
            <router-link to="/tickets/giftcards">Gift cards</router-link>
            <router-link to="/tickets/family">For the family</router-link>
            <router-link to="/tickets/exhibition">Exhibitions</router-link>
            <router-link to="/tickets/soul">Fot the soul</router-link>
        </div>

        <li v-if="test"></li>
    </div>
</template>

<style>
.navbar {
    display: flex;
    flex-direction: column;
    /* Stack the items vertically */
    justify-content: flex-start;
    /* Align the items to the top */
    padding: 1rem;
}

.navbar-top {
    display: flex;
    justify-content: flex-start;
    /* Logo on the left */
    width: 100%;
    align-items: center;
    justify-content: center;
}

.nav-logo {
    height: 60px;
    width: auto;
}

.nav-buttons {
    display: flex;
    justify-content: flex-end;
    /* Align the icons (login and cart) to the right */
    width: 100%;
    /* Ensure the buttons container spans the full width */
}

.nav-icon {
    height: 40px;
    width: auto;
    margin-left: 1rem;
    /* Space between the icons */
}

.tabs {
    display: flex;
    width: 100%;
    border-top: 1px solid #f1f2f4;
    box-sizing: border-box;
}

.tabs a,
.tabs router-link {
    color: black;
    text-decoration: none;
    padding: 1rem;
    transition: background-color 0.3s ease;
}

.tabs a:hover,
.tabs router-link:hover {
    background-color: red;
}

* {
    box-sizing: border-box;
}
</style>