<template>
    <div>
        <h1>Home Component</h1>
        <h1>{{ $store.count }}</h1>
        <Header />
    </div>
</template>

<script>

// console.log("this", this)
export default {
    name: 'HomeComponent'
}
</script>

<style lang="scss" scoped></style>