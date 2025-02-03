<script setup>
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(router.getRoutes());
</script>

<template>
    <div class="tabs is-centered">
        <ul>
            <a href=""><img src="./icons/piletilevi.svg" alt="piletilevi logo"></a>

            <!-- eslint-disable-next-line vue/require-v-for-key -->
            <li v-for="link in router.getRoutes()" :class="{ 'is-active': route.path === link.path }">
                <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
        </ul>
    </div>
</template>