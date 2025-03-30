<script lang="ts">
  import { cn } from "$lib/utils";
  import { type Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface ButtonProps extends HTMLButtonAttributes {
    class?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    children?: Snippet;
  }
  let { children, class: className, ...restProps }: ButtonProps = $props();
</script>

<button class={cn("button-primary", className)} {...restProps}>
  {@render children?.()}
</button>
