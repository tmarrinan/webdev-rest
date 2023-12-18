<template>
    <div style="justify-content: space-evenly;">
        <div class="select">
          <input class="search" placeholder="Neighborhood Name"/>
          <button class="searchButton" type="button">OK</button>
        </div>
        <!-- Dropdown with 12 options -->
        <div class="select">
            <select>
                <option value="">Select Code</option>
                <option value="1">Option 1</option>
                <option value="1">Option 2</option>
                <option value="1">Option 3</option>
                <option value="1">Option 4</option>
                <option value="1">Option 5</option>
                <option value="1">Option 6</option>
                <option value="1">Option 7</option>
                <option value="1">Option 8</option>
                <option value="1">Option 9</option>
                <option value="1">Option 10</option>
                <option value="1">Option 11</option>
                <option value="12">Option 12</option>
            </select>
        </div>
    
        <!-- Dropdown with 16 options -->
        <div class="select">
            <select>
                <option value="">Select Neighborhood</option>
                <option value="1">Option 1</option>
                <option value="1">Option 2</option>
                <option value="1">Option 3</option>
                <option value="1">Option 4</option>
                <option value="1">Option 5</option>
                <option value="1">Option 6</option>
                <option value="1">Option 7</option>
                <option value="1">Option 8</option>
                <option value="1">Option 9</option>
                <option value="1">Option 10</option>
                <option value="1">Option 11</option>
                <option value="1">Option 12</option>
                <option value="1">Option 13</option>
                <option value="1">Option 14</option>
                <option value="1">Option 15</option>
                <option value="16">Option 16</option>
            </select>
        </div>
    
        <!-- Two dropdowns to select a date -->
        <div class="select">
            <label for="date1">Select Start Date:</label>
            <input type="date" id="date1">
        </div>
    
        <div class="select">
            <label for="date2">Select End Date:</label>
            <input type="date" id="date2">
        </div>
    
        <!-- Dropdown with 8 options -->
        <div class="select">
            <select>
                <option value="">Select Limit</option>
                <option value="1">5</option>
                <option value="1">10</option>
                <option value="1">25</option>
                <option value="1">50</option>
                <option value="1">100</option>
                <option value="1">250</option>
                <option value="1">500</option>
                <option value="8">1000</option>
            </select>
        </div>
    
        <!-- Submit button -->
        <div class="select">
            <a class="button" style="width: 100%">Apply Filters</a>
        </div>
        <div class="select">
            <a class="button" style="width: 100%">Submit New Incident</a>
        </div>
        <div class="select">
            <a class="button" style="width: 100%">Delete Incident</a>
        </div>
    </div>
  </template>
  
  <style scoped>
  div {
    background-color: white;
    width: 100%;
    border-radius: 20px;
    text-align: center;
    padding: 5px;
  }
  
  .select {
    margin-bottom: 40px;
    width: 100%;
    border-radius: 10px;
    font-weight: bold;
  }
  
  /* Style the dropdowns */
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  /* Style the date inputs */
  input[type="date"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .button{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .button:hover{
    border-width: 2px;
    border-color: black;
  }

  .searchButton{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .searchButton:hover{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .search{
    width: 80%
  }
  </style>
  