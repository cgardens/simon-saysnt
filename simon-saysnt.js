;(function(win){

  heir.inherit(Board, EventEmitter);

  function Board(){
    this.moves = ['red','green','blue','yellow'];
    this.challenge = [];
    this.attempt = [];
    this.flashDelay = 500;
    this.buildBoardBindings();
  }

  var proto = Board.prototype;

  proto.buildBoardBindings = function(){
    this.moves.forEach(function(tile){
      this[tile] = $('#' + tile);
    }.bind(this))
  }

  proto.score = function() {
    return this.challenge.length;
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

  win.board = new Board();

}(this))


