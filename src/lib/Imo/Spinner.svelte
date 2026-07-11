<script>
  let { size = '24px', color = 'currentColor' } = $props();
</script>

<div class="spinner" style="--size: {size}; --color: {color}" role="status" aria-live="polite" aria-label="Loading">
  <div class="dot dot-1"></div>
  <div class="dot dot-2"></div>
  <div class="dot dot-3"></div>
</div>

<style>
  .spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: var(--size);
    height: var(--size);
  }

  .dot {
    width: 20%;
    height: 20%;
    background-color: var(--color);
    border-radius: 50%;
    animation: jump 0.8s ease-in-out infinite;
  }

  .dot-1 {
    animation-delay: 0s;
  }

  .dot-2 {
    animation-delay: 0.2s;
  }

  .dot-3 {
    animation-delay: 0.4s;
  }

  @keyframes jump {
    0%, 100% {
      transform: translateY(0);
      opacity: 1;
    }
    50% {
      transform: translateY(-150%);
      opacity: 0.6;
    }
  }
</style>
