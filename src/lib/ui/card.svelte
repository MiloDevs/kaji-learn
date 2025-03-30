<script lang="ts">
  import { cn } from "$lib/utils";

  interface CardProps {
    title: string;
    subtitle?: string;
    height?: string;
    width?: string;
    textSize?: string;
    errorClass?: string;
    successClass?: string;
    actionable?: boolean;
    onClick?: () => void;
    onHover?: () => void;
    onFocus?: () => void;
  }
  let {
    height = "h-32",
    width = "w-32",
    title,
    textSize,
    subtitle,
    actionable = false,
    errorClass = "",
    successClass = "",
    onClick,
    onHover,
    onFocus,
  }: CardProps = $props();
</script>

<button
  onclick={actionable ? onClick : undefined}
  onmouseover={actionable ? onHover : undefined}
  onfocus={actionable ? onFocus : undefined}
  class={cn(
    `bg-gray-500/30 text-white backdrop-blur-2xl shadow-lg select-none transition-all ease-in-out rounded-lg flex flex-col gap-2 items-center justify-center ${height} ${width} ${textSize} ${actionable ? "cursor-pointer hover:bg-neutral-100" : ""} ${actionable ? "active:bg-neutral-200" : ""} ${actionable ? "focus:outline-none  hover:text-black  hover:scale-105 active:scale-95" : ""}`,
    errorClass,
    successClass
  )}
>
  <p>{title}</p>
  {#if subtitle}
    <p class="text-neutral-500 text-base">{subtitle}</p>
  {/if}
</button>
