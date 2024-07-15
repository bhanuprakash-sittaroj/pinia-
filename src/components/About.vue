<!-- About.vue -->
<template>
    <div>
        <h1>About Component</h1>
        <h1>{{ $store.count }}</h1>
        <button @click="$store.increment">Increment</button>
    </div>
</template>

<script>
export default {
    name: 'AboutComponent',
};
</script>

<style lang="scss" scoped></style>
