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

                <button type="submit">{{ isEditing ? 'Update Event' : 'Create Event' }}</button>
                <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
            </form>
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
            totalTickets: ''
        });

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
                events.value = response.data;
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
                    totalTickets: eventData.value.totalTickets
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
                description: event.description,
                location: event.location,
                date: isoDate.split('T')[0],  // Extract YYYY-MM-DD
                time: isoDate.split('T')[1].slice(0, 5), // Extract HH:MM
                price: event.price,
                totalTickets: event.totalTickets || event.total_tickets // Handle different key names
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
                    totalTickets: eventData.value.totalTickets
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
            eventData.value = { id: null, title: '', description: '', location: '', date: '', time: '', price: '', totalTickets: '' };
            isEditing.value = false;
        };

        const cancelEdit = () => {
            resetForm();
        };

        onMounted(checkAdminStatus);

        return { eventData, createEvent, editEvent, updateEvent, cancelEdit, isAdmin, message, events, isEditing };
    }
};
</script>