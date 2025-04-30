<script>
export default {
    name: "EventPoster",
    props: {
        event: {
            type: Object,
            required: true,
        },
    },
    computed: {
        formattedDate() {
            const date = new Date(this.event.date * 1000); // Convert Unix timestamp to milliseconds
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
    },
};
</script>
<template>
    <router-link :to="`/event/${event.id}`" class="event-poster">
        <img :src="event.imgURL" :alt="event.title" />
        <div class="event-title">{{ event.title }}</div>
        <div class="event-date">{{ formattedDate }}</div>
        <div class="event-location">{{ event.location }}</div>
    </router-link>
</template>

<style scoped>
.event-poster {
  display: inline-block;
  margin: 1rem;
  cursor: pointer;
  text-decoration: none;
  width: 90%;     
  aspect-ratio: 2 / 3; 
  max-width: 230px; 
  height: auto;
  margin-left: auto;
  margin-right: auto;     
}
.event-title {
  margin-top: 0.5rem;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  color: #C6C6C6;
}
.event-date {
  margin-top: 0.3rem;
  font-size: 0.9rem;
  color: #888;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 0.7rem;
  -webkit-box-shadow: 0px 0px 15px 1px rgba(94, 182, 255, 0.44);
  -moz-box-shadow: 0px 0px 15px 1px rgba(94, 182, 255, 0.44);
  box-shadow: 0px 0px 15px 1px rgba(94, 182, 255, 0.44);
  transition: transform 0.3s;
}

img:hover {
  transform: scale(1.05);
}
</style>