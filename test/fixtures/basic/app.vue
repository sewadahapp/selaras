<script setup>
// A toast added during setup must not fail the server render.
useToast().add({ title: 'Saved' })
</script>

<template>
  <div>
    <div>basic</div>
    <form id="native-form" action="/submit" method="post">
      <SInput id="native-email" name="email" type="email" required autocomplete="email" />
      <SButton id="native-action">
        Action
      </SButton>
      <SButton id="native-submit" type="submit">
        Submit
      </SButton>
    </form>
  </div>
</template>
