;(function(win){

  // heir.inherit(Board, EventEmitter);

  function Board(){
    this.moves = ['red','green','blue','yellow'];
    this.challenge = [];
    this.attempt = [];
    this.flashDelay = 500;
    this.score = 0;
    this.buildBoardBindings();
  }

  var proto = Board.prototype;

  proto.buildBoardBindings = function(){
    var move = this.moves.length,
        tile;

    while(move--){
      tile = this.moves[move]

      this[tile] = $('#' + tile);

      this[tile].on('click', function(e){
        var tile = e.target.id

        this.flash(tile)
        this.attempt.push(tile)
        this.check();

      }.bind(this))

    }
  }

  // proto.score = function() {
  //   return (this.score += this.challenge.length);
  // }

  proto.newChallenge = function(){
    this.challenge = [];
    this.nextChallenge();
  }

  proto.nextChallenge = function(){
    this.challenge.push(this.getNextStep());
  }

  proto.getNextStep = function(){
    this.flashDelay = .95 * this.flashDelay;
    random_index = Math.floor(this.moves.length * Math.random());
    return this.moves[random_index];
  }

  proto.flash = function(tile){
    var opacity = this[tile].css('opacity'),
        self = this; // setTimeout ... http://stackoverflow.com/a/2130411

    this[tile].css('opacity', 1.0);
    win.setTimeout(function(){
      self[tile].css('opacity', opacity);
    },this.flashDelay);
  }

  proto.renderChallenge = function(){
    var self = this;

    this.challenge.forEach(function(tile, index){
      win.setTimeout(function(){
        self.flash(tile);
      }, Math.floor((self.flashDelay + 100) * index));
    });
  }

  proto.start = function() {
    this.newChallenge();
    this.renderChallenge();
  }

  proto.play = function() {
    this.nextChallenge();
    this.renderChallenge();
  }

  proto.playAgain = function(){
    this.attempt = [];
    win.setTimeout(this.play.bind(this), 1500);
  }

  proto.check = function(){
    if(this.attempt.length < this.challenge.length)
      return;

    var tile = this.attempt.length;

    while(tile--) {
      if (this.attempt[tile] == this.challenge[tile]) {
        this.score++;
        console.log('correct')
      } else {
        console.log('wrong!')
      }
    }

    this.playAgain();
  }

  /**
  * Player constructor
  *
  */
  function Player(name){
    this.name = name || 'Anonymous Coward'
    this.board = new Board();
    this.score = 0;
    this.firebase = null;
    // this.listen();
  }

  Player.prototype = {

    start: function(){
      this.board.start();
    },

    play: function(){
      this.board.play();
    },

    setRef: function(ref){
      this.firebase = ref;
    }

  }

  /**
  * Game constructor
  *
  */
  function Game(players){
    this.firebase = new Firebase('https://glaring-torch-7877.firebaseio.com/games');
    this.players = players || [];
    this.status = 'waiting'; // in-progress | finished
    this.id = 0; // holds firebase id for the current game
    this.setup();
  }

  Game.prototype = {

    setup: function(){
      var snapshot = this.firebase.push({'status' : this.status});
      this.setId(snapshot.key());
    },

    start: function(){
      this.players[0].start();
      // this.status = 'in-progress'
      // var idx = this.players.length;
      // while(idx--){
      //   this.players[idx].start();
      // }
    },

    setId: function(id){
      this.id = id;
    },

    addPlayer: function(name){
      var player = new Player(name);
      this.players.push(player);
      var snapshot = this.firebase.child(this.id + '/players').push({'name' : name, 'score' : 0})
      player.setRef(snapshot.ref());
    }

  }

  function Simon(){
    this.firebase = new Firebase('https://glaring-torch-7877.firebaseio.com');
    this.games = []
    this.monitorGames();
  }

  Simon.prototype = {

    newGame: function(){
      return new Game();
      // this.games.push(game)
    },

    joinGame: function(player){

    },

    listGames: function(){
      return this.games;
    },

    monitorGames: function(){
      this.game = []
      var self = this;

      this.firebase.child('games').on('value', function(snapshot){
         snapshot.forEach(function(st){
          var gameId = st.key();
          // self.games.push(new Game(gameId));
        })
      })
    }
  }
  win.simon = new Simon();

}(this))
