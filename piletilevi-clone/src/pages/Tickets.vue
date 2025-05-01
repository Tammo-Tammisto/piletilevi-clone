<template>
  <div>
    <div>
      <h2>All Events</h2>
      <div class="p-8 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <EventPoster v-for="event in events" :key="event.id" :event="event" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import EventPoster from '@/components/EventPoster.vue';

export default {
  name: "EventShowcase",
  components: {
    EventPoster,
  },
  setup() {
    const events = ref([]);
    const route = useRoute();

    const fetchEvents = async () => {
      try {
        const genre = route.params.genre;
        const endpoint = genre === 'all' ? '/event-summaries' : `/event-summaries/${genre}`;
        const response = await axios.get(`http://localhost:3000${endpoint}`);
        console.log('Fetched data:', response.data);

        // Convert id to string before storing
        const processedData = response.data.map(event => ({
          ...event,
          id: String(event.id),
        }));

        events.value = processedData;
        localStorageCheck();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    onMounted(() => {
      fetchEvents();
    });

    watch(() => route.params.genre, () => {
      fetchEvents();
    });

    function localStorageCheck() {
      const storedEvents = localStorage.getItem("localEvents");
      const currentEvents = JSON.stringify(events.value);

      if (!storedEvents || JSON.stringify(JSON.parse(storedEvents)) !== currentEvents) {
        console.log("new events", events.value);
        localStorage.setItem('localEvents', currentEvents);
      } else {
        console.log("Events already in localStorage:", JSON.parse(storedEvents));
      }
    }

    if (localStorage.getItem("localEvents")) {
      events.value = JSON.parse(localStorage.getItem("localEvents"));
    }

    return {
      events,
    };
  },
};
</script>