<script lang="ts">
    import Imo from './lib/Imo.svelte';

    let darkTheme = $state(false);
</script>

<svelte:head>
    <link rel="icon" type="image/svg+xml" href="./node_modules/@collagejs/core/dist/logos/collagejs-16.svg" />
</svelte:head>

<main class:dark={darkTheme}>
    <Imo />
    <p>
        <button type="button" onclick={() => (darkTheme = !darkTheme)}>Theme</button>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus voluptates deserunt voluptatem, sunt ab quasi
        optio hic sed eos quo vitae facilis, harum esse doloremque ipsam eaque consequuntur magni. Fugit cumque praesentium
        facere magnam deserunt dolorem delectus alias laboriosam libero? Repellendus est eos cupiditate, consectetur facilis
        laborum numquam neque esse harum fugiat perspiciatis deserunt quas necessitatibus tenetur rem corrupti eius debitis.
        Impedit, voluptates, quae beatae labore velit ipsum earum dolorum inventore totam exercitationem harum veritatis
        tenetur sint! Temporibus delectus harum aliquam perspiciatis suscipit expedita alias. Maxime explicabo, beatae consequatur
        dignissimos ex harum itaque laborum corporis quisquam. Maxime neque sed sequi quasi error voluptates quo vel architecto
        deleniti vero sapiente iusto odio nisi sunt, excepturi ratione perferendis! Nam odio aliquam, sint consectetur aperiam
        aliquid facere sunt possimus consequuntur laborum optio! Necessitatibus consequatur aspernatur suscipit. Voluptatibus
        vero fugit iure molestias consectetur, officia esse? Vitae facilis voluptas quis exercitationem neque quibusdam,
        consequuntur eveniet.
    </p>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis officiis consectetur similique sunt, nulla eos
        unde eius iusto recusandae labore temporibus minus, incidunt culpa nisi odit doloribus, ex atque provident? Nam
        ducimus enim repellat, aliquam voluptatibus dolorum itaque dicta culpa eaque dolore, tempora illum sunt, libero
        qui distinctio adipisci ex. Iste dolorum fugit provident repellendus molestiae debitis sequi labore explicabo
        esse earum officiis reprehenderit, repudiandae alias tempora molestias accusamus cumque, mollitia voluptatibus
        magni error officia veniam culpa non maxime. Laborum rerum, similique, aliquam odio eos architecto voluptatem
        blanditiis voluptas quisquam facilis quod! Adipisci necessitatibus corrupti tenetur commodi soluta ducimus
        magnam quisquam animi, mollitia velit at aspernatur? Ad consequatur dignissimos nobis.
    </p>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius temporibus quasi omnis atque ducimus labore nobis
        asperiores dolores debitis? Cupiditate, obcaecati. Consequatur provident molestias architecto, possimus eaque
        sapiente fugiat vel aut neque? Quae, praesentium quas laudantium necessitatibus ullam accusamus reprehenderit,
        velit delectus esse, sunt veniam ducimus est atque deleniti. Eaque distinctio sapiente enim praesentium iusto,
        consequuntur debitis provident accusantium dolore minima illo quia voluptas. Facere cupiditate atque architecto
        veniam nihil! Omnis reprehenderit quo fuga necessitatibus?
    </p>
</main>

<style>
    :global(body) {
        margin: 0;
    }
    main {
        color-scheme: light dark;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-flow: column-reverse;
        justify-content: space-between;
        gap: 1rem;
        background: linear-gradient(135deg, #7b98b6, #e9ecef, #d2b1ec);
        height: 100vh;

        &.dark {
            color: rgb(236, 227, 227);
            background: linear-gradient(135deg, #1e293b, #374151, #453750);
        }
        @media (prefers-color-scheme: dark) {
            color: rgb(236, 227, 227);
            background: linear-gradient(135deg, #1e293b, #374151, #453750);
        }
    }
</style>
