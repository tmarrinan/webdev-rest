<template>
    <div class="grid-container">
      <div class="grid-x" style="width: 100%">
        <div class="cell large-3 columns" style="padding: 5px">
          <div class="div1" style="background-color: rgb(252, 96, 99)">
              Violent Crime 
          </div>
        </div>
        <div class="cell large-3 columns" style="padding: 5px">
          <div class="div1" style="background-color: rgb(252, 203, 104)">
              Property Crime 
          </div>
        </div>
        <div class="cell large-3 columns" style="padding: 5px;">
          <div class="div1" style="background-color: rgb(104, 252, 161)">
              Other
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .div1 {
    font-weight: bold;
    border-radius: 10px;
    width: 100%;
    text-align: center;
  }
  
  .grid-container {
    max-width: 1200px;
    margin: 0px;
  }

  .grid-x {
    display: flex;
    justify-content: space-evenly;
  }
  </style>
  