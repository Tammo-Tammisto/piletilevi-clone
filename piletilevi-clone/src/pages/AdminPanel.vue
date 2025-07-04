<template>
    <div v-if="isAdmin" class="AdminPanel">
        <div class="CreateEventContainer">
            <h1>{{ isEditing ? 'Edit Event' : 'Create Event' }}</h1>
            <form @submit.prevent="isEditing ? updateEvent() : createEvent()">
                <label for="eventName">Event Name</label>
                <input type="text" id="eventName" v-model="eventData.title" required>

                <label for="eventDescription">Event Description</label>
                <textarea id="eventDescription" v-model="eventData.description" required></textarea>

                <label for="eventLocation">Event Location</label>
                <input type="text" id="eventLocation" v-model="eventData.location" required>

                <label for="eventDate">Event Date</label>
                <input type="date" id="eventDate" v-model="eventData.date" required>

                <label for="eventTime">Event Time</label>
                <input type="time" id="eventTime" v-model="eventData.time" required>

                <label for="eventPrice">Event Price</label>
                <input type="number" id="eventPrice" v-model="eventData.price" required>

                <label for="eventTotalTickets">Total Tickets</label>
                <input type="number" id="eventTotalTickets" v-model="eventData.totalTickets" required>

                <label for="eventGenre">Event Genres</label>
                <div id="eventGenre">
                    <label v-for="genre in availableGenres" :key="genre">
                        <input type="checkbox" :value="genre" v-model="eventData.genres" />
                        {{ genre }}
                    </label>
                </div>

                <label for="image">Event Image</label>
                <input type="file" id="image" @change="(event) => { console.log('File input change event triggered'); uploadImage(event); }" required />

                <button type="submit">{{ isEditing ? 'Update Event' : 'Create Event' }}</button>
                <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
            </form>
            <p v-if="eventData.imageUrl">Image URL: {{ eventData.imageUrl }}</p>
            <p v-if="message">{{ message }}</p>
        </div>

        <div class="EditEventContainer">
            <h1>Manage Events</h1>
            <ul>
                <li v-for="event in events" :key="event.id">
                    {{ event.title }} - <button @click="editEvent(event)">Edit</button>
                </li>
            </ul>
        </div>
    </div>
    <div v-else>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const imgbbApiKey = "b348f798ea0cc038a183a777e4ee0209";

export default {
    setup() {
        const eventData = ref({
            id: null,
            title: '',
            description: '',
            location: '',
            date: '',
            time: '',
            price: '',
            totalTickets: '',
            imageUrl: '',
            genres: [],
        });

        const availableGenres = ["music", "theater", "sport", "festival", "giftcards", "family", "exhibition", "soul"];

        const events = ref([]);
        const isAdmin = ref(false);
        const message = ref('');
        const isEditing = ref(false);

        // Check if the user is an admin
        const checkAdminStatus = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.id) {
                    console.warn("No user found in localStorage.");
                    return;
                }

                const response = await axios.post('http://localhost:3000/is-admin', { userId: user.id });
                isAdmin.value = response.data.isAdmin;
                if (isAdmin.value) {
                    fetchEvents();
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        };

        // Fetch events from the database
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/events');
                events.value = response.data.map(event => ({
                    ...event,
                    genres: event.genre ? event.genre.split(',') : [] // Split genres into an array
                }));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        // Send new event data to the server
        const createEvent = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.id) {
                    message.value = "User not found. Please log in.";
                    return;
                }

                const dateTimeString = `${eventData.value.date}T${eventData.value.time}:00`;
                const eventTimestamp = Math.floor(new Date(dateTimeString).getTime() / 1000);

                const response = await axios.post('http://localhost:3000/new-event', {
                    userId: user.id,
                    title: eventData.value.title,
                    description: eventData.value.description,
                    location: eventData.value.location,
                    date: eventTimestamp,
                    price: eventData.value.price,
                    totalTickets: eventData.value.totalTickets,
                    imageUrl: eventData.value.imageUrl,
                    genre: eventData.value.genres.join(",") // Combine genres into a single string
                });

                message.value = response.data.message;
                fetchEvents();
                resetForm();
            } catch (error) {
                console.error('Error creating event:', error);
                message.value = "Failed to create event.";
            }
        };

        // Populate form with selected event data for editing
        const editEvent = (event) => {
            isEditing.value = true;

            // Convert timestamp to ISO format
            let isoDate = new Date((event.date + 7200) * 1000).toISOString();

            eventData.value = {
                id: event.id,
                title: event.title,
                description: event.description || '', // Ensure description is populated
                location: event.location,
                date: isoDate.split('T')[0],  // Extract YYYY-MM-DD
                time: isoDate.split('T')[1].slice(0, 5), // Extract HH:MM
                price: event.price || 0, // Ensure price is populated
                totalTickets: event.totalTickets || event.total_tickets || 0, // Handle different key names and ensure totalTickets is populated
                imageUrl: event.imgURL || '',
                genres: event.genre ? event.genre.split(',') : [] // Split genres into an array
            };
        };

        // Update event in the database
        const updateEvent = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.id) {
                    message.value = "User not found. Please log in.";
                    return;
                }

                const dateTimeString = `${eventData.value.date}T${eventData.value.time}:00`;
                const eventTimestamp = Math.floor(new Date(dateTimeString).getTime() / 1000);

                const response = await axios.put(`http://localhost:3000/update-event/${eventData.value.id}`, {
                    title: eventData.value.title,
                    description: eventData.value.description,
                    location: eventData.value.location,
                    date: eventTimestamp,
                    price: eventData.value.price,
                    totalTickets: eventData.value.totalTickets,
                    imageUrl: eventData.value.imageUrl,
                    genre: eventData.value.genres.join(",") // Combine genres into a single string
                });

                message.value = response.data.message;
                fetchEvents();
                resetForm();
            } catch (error) {
                console.error('Error updating event:', error);
                message.value = "Failed to update event.";
            }
        };

        // Reset form and cancel editing
        const resetForm = () => {
            eventData.value = { id: null, title: '', description: '', location: '', date: '', time: '', price: '', totalTickets: '', imageUrl: '', genres: [] };
            isEditing.value = false;
        };

        const cancelEdit = () => {
            resetForm();
        };

        // Move the uploadImage function inside the setup function
        const uploadImage = async (event) => {
            console.log('uploadImage function triggered');

            const file = event.target.files[0];
            if (!file) {
                console.error('No file selected for upload.');
                return;
            }

            console.log('Uploading file:', file.name);

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('ImgBB API response:', response.data);

                if (response.data && response.data.data && response.data.data.url) {
                    eventData.value.imageUrl = response.data.data.url;
                    console.log('Image URL set to:', eventData.value.imageUrl);
                } else {
                    console.error('No image link returned from ImgBB API');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };

        onMounted(checkAdminStatus);

        // Add uploadImage to the return statement
        return { eventData, createEvent, editEvent, updateEvent, cancelEdit, isAdmin, message, events, isEditing, uploadImage, availableGenres };
    }
};
</script>