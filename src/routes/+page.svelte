<script lang="ts">
  import Button from "$lib/ui/button.svelte";
  import Card from "$lib/ui/card.svelte";
  import { debounce } from "$lib/utils";
  import { fade } from "svelte/transition";
  let opening = true;

  interface Question {
    kanji: string;
    meaning: string;
    readings: string[];
    answer: string;
  }

  let currentQuestion = 0;
  let currentScore = 0;
  let currentFailures = 0;
  let incorrectAnswers: string[] = [];
  let correctAnswers: string[] = [];
  let intermitentState = false;
  let showGameOver = false;

  // choices
  let questions: Question[] = [
    {
      kanji: "本",
      meaning: "sun",
      readings: ["にち", "じつ", "ひ", "か"],
      answer: "にち",
    },
    {
      kanji: "月",
      meaning: "moon",
      readings: ["つき", "がつ"],
      answer: "つき",
    },
    {
      kanji: "火",
      meaning: "fire",
      readings: ["ひ", "か"],
      answer: "か",
    },
  ];

  // start game
  function startGame() {
    // hide opening screen
    opening = false;
    // reset game state
    currentQuestion = 0;
    currentScore = 0;
    currentFailures = 0;
    incorrectAnswers = [];
    correctAnswers = [];
    intermitentState = false;
    showGameOver = false;
  }

  // reset game
  function resetGame() {
    // reset game state
    currentQuestion = 0;
    currentScore = 0;
    currentFailures = 0;
    incorrectAnswers = [];
    correctAnswers = [];
    intermitentState = false;
    showGameOver = false;
    opening = true;
  }

  function handleSubmit(reading: string) {
    // clear the previous incorrect answers
    intermitentState = true;
    incorrectAnswers = [];
    correctAnswers = [];
    console.log("reading", reading);
    // check if the answer is correct
    const question = questions[currentQuestion];
    const answer = question.answer;

    if (reading === answer) {
      // correct answer
      correctAnswers.push(reading);
      currentScore++;
      // go to next question
      debounce(() => {
        intermitentState = false;
        // clear the previous incorrect answers and questions
        correctAnswers = [];
        incorrectAnswers = [];
        if (currentQuestion >= questions.length - 1) {
          // end of game
          showGameOver = true;
          return;
        }
        currentQuestion++;
      }, 1000)();
    } else {
      // incorrect answer
      incorrectAnswers.push(reading);
      currentFailures++;
      debounce(() => {
        intermitentState = false;
        console.log("cleared");
        incorrectAnswers = [];
        correctAnswers = [];
        if (currentQuestion >= questions.length - 1) {
          // end of game
          showGameOver = true;
          return;
        }
        currentQuestion++;
      }, 1000)();
    }
  }
</script>

{#if opening}
  <div
    class="h-screen flex flex-col gap-4 items-center bg-gradient-to-br from-blue-800 to-teal-800 justify-center"
  >
    <h1 class="font-semibold text-2xl text-white">A kanji Game</h1>
    <p class="text-neutral-100 text-md">
      Test your kanji knowledge with this game!
    </p>
    <Button onclick={startGame} class="">Let's go</Button>
  </div>
{:else}
  <div
    class="h-screen grid grid-cols-2 place-content-center bg-slate-800 p-6 items-center justify-center"
  >
    <div class="absolute top-0 left-0 p-4">
      <h1 class="font-semibold text-2xl text-white">
        Question {currentQuestion + 1} of {questions.length}
      </h1>
      <p class="text-neutral-200 text-md">What is the reading of the kanji?</p>
    </div>
    <div class="absolute top-0 right-0 p-4">
      <h1 class="font-semibold text-2xl text-white">Score</h1>
      <p class="font-semibold text-white mt-2 flex -space-y-4 text-2xl">
        <span class="text-left">{currentScore}</span>
        <span class="mx-0.5 mt-2">/</span>
        <span class="text-red-500 mt-4"> {currentFailures} </span>
      </p>
    </div>
    <!-- To compare -->
    <div class="flex flex-1 items-center justify-center">
      {#key questions[currentQuestion].kanji}
        <Card
          title={questions[currentQuestion].kanji}
          subtitle={"(" + questions[currentQuestion].meaning + ")"}
          height="h-128"
          width="w-64"
          textSize={"text-8xl"}
        />
      {/key}
    </div>
    <!-- choices -->
    <div class="flex items-center justify-center">
      <div class="grid grid-cols-2 gap-4">
        {#each questions[currentQuestion].readings as reading}
          <Card
            title={reading}
            height="h-64"
            width="w-42"
            textSize={"text-2xl"}
            successClass={correctAnswers.includes(reading)
              ? "bg-green-500 hover:bg-green-500"
              : ""}
            errorClass={incorrectAnswers.includes(reading)
              ? "bg-red-500 hover:bg-red-500"
              : ""}
            actionable={!intermitentState}
            onClick={() => handleSubmit(reading)}
          />
        {/each}
      </div>
    </div>
  </div>
{/if}

<!-- Game Over screen -->

{#if showGameOver}
  <div
    transition:fade
    class="h-screen w-full flex flex-col gap-4 items-center absolute top-0 left-0 backdrop-blur justify-center"
  >
    <h1 class="font-semibold text-2xl text-white">Game Over</h1>
    <p class="text-neutral-100 text-md">
      Your score is {currentScore} out of {questions.length}
    </p>
    {#if currentScore === 1}
      <p class="text-neutral-100 text-md">Damn! You bad bad (｡•́︿•̀｡)</p>
    {:else if currentScore === questions.length}
      <p class="text-neutral-100 text-md">You're good! for now! ≧☉_☉≦</p>
    {/if}
    <Button onclick={resetGame} class="">Play again</Button>
  </div>
{/if}
