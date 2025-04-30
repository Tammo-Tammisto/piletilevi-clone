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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import EventPoster from '@/components/EventPoster.vue';

export default {
  name: "EventShowcase",
  components: {
    EventPoster,
  },
  setup() {
    const events = ref([]);

    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events');
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