;(function(win){

  heir.inherit(Board, EventEmitter);

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
        this.attempt.push(e.target.id)
      }.bind(this))

    }
  }

  proto.score = function() {
    return (this.score += this.challenge.length);
  }

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
      }, Math.floor((self.flashDelay + 200) * index));
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

  proto.check = function(item){
    this.attempt.push(item);

    var lastItem = attempt.length-1;

    if (this.challenge[lastItem] === this.attempt[lastItem]) {
      this.score++;
      console.log('correct!');
      console.log('your score is now ' + this.score);
      // this.updateScore()
    }

  }

  win.board = new Board();

}(this))
