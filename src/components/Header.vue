<template>
    <div>
        <h1>Header Component</h1>
        <h1>{{ $store.count }}</h1>
        <h1>{{ $store.defaultSessionCount }}</h1>
    </div>
</template>

<script>
// console.log("this", $store)
export default {
    name: 'HeaderComponent',
    mounted(){
        console.log("Store Values:", JSON.parse(JSON.stringify(this)));
    }
}
</script>

<style lang="scss" scoped></style>