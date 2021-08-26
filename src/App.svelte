<script lang="ts">
  export let name: string;
</script>

<main>
  <!-- Some tailwindcss -->
  <h1 class="text-[#ff3e00] uppercase text-6xl font-extralight py-12">
    Hello {name}!
  </h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>
</main>

<style>
  /* <style> tags still work! */
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
