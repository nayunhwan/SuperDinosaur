var display = document.getElementById("display");
var scoreMessage = document.getElementById("scoreMessage");
var timeMessage = document.getElementById("timeMessage");

var startScreen = document.getElementById("startScreen");
var playScreen = document.getElementById("playScreen");
var endScreen = document.getElementById("endScreen");

var startButton = document.getElementById("startButton");
var endButton = document.getElementById("endButton");

var mainGame = document.getElementById("mainGame");
var character;
var characterTimer;
var enemys = [];
var clouds = [];
var lands = [];
var items = [];
var isOver;

var gScore;

var jumpTimer = null;
var myTimer = null;
var createTimer = null;

(function() {
  init();
})();

function init() {
  display.innerHTML = "게임을 시작할 준비가 되었습니다.";
  startScreen.src = "images/titleScreen.jpg";
  playScreen.src = "images/playScreen.jpg";
  endScreen.src = "images/endScreen.jpg";

  startScreen.style.display = "block";
  startButton.style.display = "block";
  playScreen.style.display = "none";
  scoreMessage.style.display = "none";
  timeMessage.style.display = "none";
  endScreen.style.display = "none";
  endButton.style.display = "none";

  startButton.addEventListener("click", function() {
    startScreen.style.display = "none";
    startButton.style.display = "none";
    main();
    this.removeEventListener("click", arguments.callee);
  });
}

function main() {
  console.log("메인 게임을 시작한다");

  isOver = false;
  gScore = 0;
  var gTime = 0;
  var gTimeLimit = 1005;

  var jumpFlag = false;

  var cloudCnt = 0;
  var enemyCnt = 0;

  var isCollision = false;
  var durationSpeed = 7000;
  var jumpPx = 300;

  lands = [];
  clouds = [];
  enemys = [];
  items = [];

  timeMessage.innerHTML = gTime;
  scoreMessage.innerHTML = gScore;
  display.innerHTML =
    "게임이 진행 중입니다" +
    "</br>" +
    "여의주를 먹으면 점수를 획득합니다. 다른 것들은 피하세요";

  playScreen.style.display = "block";
  scoreMessage.style.display = "block";
  timeMessage.style.display = "block";

  function plusScore(point) {
    gScore += point;
    scoreMessage.innerHTML = gScore;
    // endCheck();
  }

  function minusScore() {
    gScore -= 10;
    scoreMessage.innerHTML = gScore;
    endCheck();
  }

  myTimer = window.setInterval(function iTimer() {
    gTime++;
    timeMessage.innerHTML = gTime;
    endCheck();
    console.log("시간: " + gTime + " ,타이머: " + myTimer);
  }, 1000);

  createTimer = window.setInterval(function() {
    var rand = Math.floor(Math.random() * 20);
    if (rand === 0) {
      if (cloudCnt < 3) {
        createCloud();
      }
    } else if (rand === 10) {
      if (enemyCnt < 3) {
        createEnemy();
      }
    } else if (rand === 11) {
      if (items.length < 1) {
        createItem();
      }
    }
    setTimeout(function() {
      if (character.src.includes("images/character.png")) {
        character.src = "images/character2.png";
      } else {
        character.src = "images/character.png";
      }
    }, durationSpeed / 100);

    durationSpeed -= 10;
    plusScore(1);
    endCheck();
  }, 100);

  function endCheck() {
    if (durationSpeed <= 100 || isCollision) {
      console.log("END");
      window.clearInterval(myTimer);
      window.clearInterval(createTimer);
      endGame();
      ending();
    }
  }

  function moveObject(object, duration) {
    $(object).animate(
      {
        left: ["-500px", "linear"]
      },
      duration,
      function() {
        if (object.className === "cloud") {
          cloudCnt--;
          clouds = clouds.slice(1);
        } else if (object.className === "enemy") {
          enemyCnt--;
          enemys = enemys.slice(1);
        } else if (object.className === "item") {
          items.pop();
        }
        $(object).remove();
      }
    );
  }

  function createLand() {
    var land = document.createElement("IMG");
    land.src = "images/land.png";
    land.className = "land";
    land.style.bottom = "0px";
    land.style.right = "0px";
    lands.push(land);
    $(land).animate(
      {
        right: ["1366px", "linear"]
      },
      durationSpeed,
      function() {
        $(land).remove();
        lands = lands.slice(1);
        if (!isOver) createLand();
      }
    );
    mainGame.appendChild(land);

    var land2 = document.createElement("IMG");
    land2.src = "images/land.png";
    land2.className = "land";
    land2.style.bottom = "0px";
    land2.style.right = "-1366px";

    lands.push(land2);

    $(land2).animate(
      {
        right: ["1366px", "linear"]
      },
      durationSpeed * 2,
      function() {
        $(land2).remove();
        lands = lands.slice(1);
      }
    );
    mainGame.appendChild(land2);
  }

  function createCloud() {
    cloudCnt++;
    var cloud = document.createElement("IMG");
    var rand = Math.floor(Math.random() * 10);
    if (rand % 2 === 0) {
      cloud.src = "images/cloud1.png";
    } else {
      cloud.src = "images/cloud2.png";
    }
    cloud.className = "cloud";
    cloud.style.top = Math.floor(Math.random() * 100) + 10 + "px";
    cloud.style.left = "1500px";
    clouds.push(cloud);
    moveObject(cloud, durationSpeed);
    mainGame.appendChild(cloud);
  }

  function createItem() {
    var itemObject = {
      element: document.createElement("IMG"),
      collisionTimer: null
    };
    items.push(itemObject);
    var item = itemObject.element;
    item.src = "images/item.png";
    item.className = "item";
    item.style.top = "567px";
    item.style.left = "1500px";

    itemObject.collisionTimer = setInterval(function() {
      var characterLeft = parseFloat(character.style.left);
      var characterBottom = parseFloat(character.style.top) + 129;

      var itemLeft = parseInt(item.style.left);
      var itemTop = parseInt(item.style.top);
      var itemBottom = itemTop + 87;

      var xCollisionCondition =
        itemLeft >= characterLeft && itemLeft <= characterLeft + 120;
      var yCollisionCondition =
        characterBottom <= itemBottom && characterBottom >= itemTop;

      if (xCollisionCondition && yCollisionCondition) {
        window.clearInterval(itemObject.collisionTimer);
        plusScore(100);
        $(item).remove();
      }
    }, 10);
    moveObject(item, durationSpeed);
    mainGame.appendChild(item);
  }

  function createEnemy() {
    enemyCnt++;
    var enemyObject = {
      element: document.createElement("IMG"),
      collisionTimer: null
    };
    var enemy = enemyObject.element;
    var rand = Math.floor(Math.random() * 2);
    var eneymyHeight = 0;
    if (rand == 0) {
      enemy.src = "images/enemy1.png";
      enemy.style.top = "499px";
      eneymyHeight = 155;
    } else if (rand == 1) {
      enemy.src = "images/enemy2.png";
      enemy.style.top = "565px";
      eneymyHeight = 89;
    }
    enemy.style.left = "1500px";
    enemy.className = "enemy";
    enemyObject.collisionTimer = setInterval(function() {
      var characterLeft = parseFloat(character.style.left);
      var characterBottom = parseFloat(character.style.top) + 129;

      var enemyLeft = parseFloat(enemy.style.left);
      var eneymyTop = parseFloat(enemy.style.top);
      var enemyBottom = eneymyTop + eneymyHeight;

      var xCollisionCondition =
        enemyLeft >= characterLeft && enemyLeft <= characterLeft + 120;
      var yCollisionCondition =
        characterBottom <= enemyBottom && characterBottom >= eneymyTop;

      if (xCollisionCondition && yCollisionCondition) {
        isCollision = true;
      }
    }, 10);
    enemys.push(enemyObject);
    moveObject(enemy, durationSpeed);
    mainGame.appendChild(enemy);
  }

  function createCharacter() {
    character = document.createElement("IMG");
    character.src = "images/character.png";
    character.className = "character";
    character.style.top = "525px";
    character.style.left = "100px";

    mainGame.appendChild(character);
  }

  var isJumping = false;

  $(window).keydown(function(e) {
    if (e.keyCode === 13 && !jumpFlag && !isJumping) {
      console.log(jumpFlag);
      jumpFlag = true;
      isJumping = true;
      $(character).animate(
        {
          top: `-=${jumpPx}`
        },
        500
      );

      jumpTimer = setTimeout(function() {
        var keyUpEvent = $.Event("keyup", { keyCode: 13 });
        $(window).trigger(keyUpEvent);
      }, 2000);
    }
  });

  $(window).keyup(function(e) {
    if (e.keyCode === 13 && jumpFlag && isJumping) {
      jumpFlag = false;
      window.clearTimeout(jumpTimer);
      $(character).animate(
        {
          top: `+=${jumpPx}`
        },
        500,
        function() {
          isJumping = false;
        }
      );
    }
  });

  createLand();
  createCharacter();
}

function endGame() {
  isOver = true;
  playScreen.style.display = "none";
  scoreMessage.style.display = "none";
  timeMessage.style.display = "none";

  window.clearInterval(myTimer);
  window.clearInterval(createTimer);
  window.clearInterval(jumpTimer);

  console.log("clouds", clouds);
  console.log("enemy", enemys);
  console.log("lands", lands);

  $(character).remove();
  clouds.forEach(function(cloud) {
    $(cloud).remove();
  });

  enemys.forEach(function(enemyObject) {
    window.clearInterval(enemyObject.collisionTimer);
    $(enemyObject.element).remove();
  });

  lands.forEach(function(land) {
    $(land).remove();
  });

  items.forEach(function(itemObject) {
    window.clearInterval(itemObject.collisionTimer);
    $(itemObject.element).remove();
  });
  $(window).off();
}

function ending() {
  display.innerHTML =
    `게임이 끝났습니다, 획득한 점수는 ${gScore}점 입니다` +
    "</br>" +
    "버튼을 클릭하면 게임을 다시 시작합니다";

  endScreen.style.display = "block";
  endButton.style.display = "block";

  endButton.addEventListener("click", function() {
    console.log("종료 버튼을 눌렀다");
    endScreen.style.display = "none";
    endButton.style.display = "none";
    init();
    this.removeEventListener("click", arguments.callee);
  });
}
