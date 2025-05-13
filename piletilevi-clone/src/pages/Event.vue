<template>
    <div>
        <h1>Event: {{ eventDetails.title }}</h1>
        <img :src="eventDetails.imgURL" alt="Event Image" class="event-image" />
        <h1>Description: {{ eventDetails.description }}</h1>
        <h1>Location: {{ eventDetails.location }}</h1>
        <h1>Date: {{ formattedDate }}</h1>
        <h1>Time: {{ formattedTime }}</h1>
        <h1>Price: {{ eventDetails.price }} €</h1>
        <h1>Total Tickets: {{ eventDetails.total_tickets }}</h1>
        <h1>Genres: {{ eventDetails.genres.join(', ') }}</h1>
    </div>
    <button @click="$router.push('/purchase/' + eventId)">Purchase a ticket</button>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const eventId = ref('');
const eventDetails = ref({
    id: null,
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    price: 0,
    total_tickets: 0,
    imgURL: '',
    genres: [],
});

// Computed properties for formatted date and time
const formattedDate = computed(() => {
    if (eventDetails.value.date) {
        const date = new Date(eventDetails.value.date * 1000); // Convert timestamp to milliseconds
        return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    }
    return '';
});

const formattedTime = computed(() => {
    if (eventDetails.value.date) {
        const date = new Date(eventDetails.value.date * 1000); // Convert timestamp to milliseconds
        return date.toISOString().split('T')[1].slice(0, 5); // Extract HH:MM
    }
    return '';
});

const fetchData = async () => {
    const route = useRoute();

    eventId.value = route.params.id;

    const response = await axios.get(`http://localhost:3000/event/${eventId.value}`);
    const eventData = response.data;
    if (eventData) {
        eventDetails.value = {
            ...eventData,
            genres: eventData.genre ? eventData.genre.split(',') : [],
        };
        console.log('Event details:', eventDetails.value);
    } else {
        console.error('Event not found');
    }
};

onMounted(() => {
    fetchData();
});
</script>