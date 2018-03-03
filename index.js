var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var PF = require('pathfinding');
var app = express();
var {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js');

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001));

app.enable('verbose errors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(poweredByHandler);

// --- SNAKE LOGIC GOES BELOW THIS LINE ---



// Handle POST request to '/start'
app.post('/start', (request, response) => {
  // NOTE: Do something here to start the game

  // Board width, height and game id.
  gameDetails = request.body;


  // Pass gameDetails into a function to set initial board state.

  // Response data
  var data = {
    color: '#FFFFFF',
    head_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Acid-free_paper_%28symbol%29.svg', // optional, but encouraged!
    taunt: "To infinity and beyond!", // optional, but encouraged!
  };
  
  return response.json(data);
});


// Handle POST request to '/move'
app.post('/move', (request, response) => {

  var snakeCoordinates = [];

  var board;

  // Takes in object containing game details: width, height, id.
  var setBoardState = (width, height, snakeCoordinates) => {
    board = new PF.Grid(width, height);
    if (snakeCoordinates.length > 0) {
      snakeCoordinates.forEach((coordinate) => {
        console.log("Snake coordinate: ");
        console.log(coordinate);
        board.setWalkableAt(coordinate.x, coordinate.y, false);
      });
    }
  };

  // Takes in an array of snake objects.
  // Returns an array of coordinate objects for all snake positions.
  // To be used to mark positions as unwalkable in Pathfinding.
  var collectSnakeCoordinates = (snakes) => {
    // Loop over all snakes.
    snakes.forEach((snake) => {

      // Set variable to array of position objects
      var snakePosition = snake.body.data;

      // Add each coordinate snake occupies to collection of snake coordinates.
      snakePosition.forEach((coordinate) => {
        snakeCoordinates.push(coordinate);
      });

    });

  };

  collectSnakeCoordinates(request.body.snakes.data);
  console.log(snakeCoordinates);

  setBoardState(request.body.width, request.body.height, snakeCoordinates);



  // Take all snake coordinates and plot out a board to mark spots safe or unsafe
  
  // var currentBoard = setBoardState(boardWidth, boardHeight, coordinates);

  console.log("Current board");
  console.log(board.nodes);

  // The data variable which contains our move. 
  // TODO: Make it update data.move based on board safety.

  var data = {
    move: 'up', // one of: ['up','down','left','right']
    taunt: 'Come on you snakes, you wanna live forever?', // optional, but encouraged!
  };

  return response.json(data);
});

app.post('/end', (request, response) => {
  return response.sendStatus(200);
});

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'));
});
