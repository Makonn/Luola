/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

document.getElementById("modalButton").addEventListener("click", run);
window.addEventListener("click", timer);

function road(){
    this.sound = "sound/step.mp3";
    this.picture = "img/road.png";
    this.info = "Tie";
    this.revealed = false;
}

function dragon() {
    this.sound = "sound/dragon.mp3";
    this.picture = "img/dragon.png";
    this.defeated = false;
    this.info = "Lohikäärme";
    this.revealed = false;
}

function skeleton() {
    this.sound = "sound/skeleton.mp3";
    this.picture = "img/skeleton.png";
    this.defeated = false;
    this.info = "Luurankoja";
    this.revealed = false;
}

function wizard() {
    this.sound = "sound/wizard.mp3";
    this.picture = "img/wizard.png";
    this.defeated = false;
    this.info = "Velho";
    this.revealed = false;
}

function sword() {
    this.sound = "sound/sword.mp3";
    this.picture = "img/sword.png";
    this.info = "Miekka - Tästä on apua luurankoja vastaan";
}

function shield() {
    this.sound = "sound/shield.mp3";
    this.picture = "img/shield.png";
    this.info = "Kilpi - Jotain minkä taakse suojautua lohikäärmeitä vastaan";
}

function wand() {
    this.sound = "sound/wand.mp3";
    this.picture = "img/wand.png";
    this.info = "Taikasauva - Taikoja taikureita vastaan";
}

function kitty() {
    this.sound = "sound/kitten.mp3";
    this.picture = "img/kitty.png"; 
    this.info = "Kissanpentu - Hyödytön, mutta ainakin on seuraa";
}

function trsr() {
    this.sound = "sound/crate.mp3";
    this.clicks = 0;
    this.opened = false;
    this.revealed = false;
    this.picture = "img/crateClosed.png";
    this.prize = 0;
    this.info = "Aarre";
    this.guardian = null;
}

function wall(){
    this.sound = "sound/stone.mp3";
    this.picture = "img/stone.png";
    this.info = "Kivi";
}

var inventory = [null, null, null];
var levelToPlay;
var prize = 0;

var runs = 1;

var treasure = "Aarre";
var re = "Pelaa uudestaan";
var cur = " euroa!";
var win = "Voitit: ";
var noWin = "Ei voittoa";
var goodLuck = "Onnea matkaan";
var inventoryRevealed = 0;

function gameLevel(){
    
    var seed = Math.floor((Math.random() * 10) + 1);
    
    if(seed === 1)
        levelToPlay = level1;
    else if(seed === 2)
        levelToPlay = level2;
    else if(seed === 3)
        levelToPlay = level3;
    else if(seed === 4)
        levelToPlay = level4;
    else if(seed === 5)
        levelToPlay = level5;
    else if(seed === 6)
        levelToPlay = level6;
    else if(seed === 7)
        levelToPlay = level7;
    else if(seed === 8)
        levelToPlay = level8;
    else if(seed === 9)
        levelToPlay = level9;
    else
        levelToPlay = level10;
    
    for(var i = 0; i < levelToPlay.length; i++){
        if(levelToPlay[i] === 'wall'){
            var w = new wall();
            levelToPlay[i] = w;
        }
        else if(levelToPlay[i] === 'road'){
            var r = new road();
            levelToPlay[i] = r;
        }
        else if (levelToPlay[i] === 'enmy'){
            var e = rollEnemy();
            levelToPlay[i] = e;
        }
        else if (levelToPlay[i] === 'trsr'){
            var t = new trsr();
            levelToPlay[i] = t;
            rollPrize(t);
        }
    }
    
    setGuardian();
    
    for(var i = 1; i < 50; i++){
        $("#box" + "" + i).bind('click', function(){
            handleBox($(this));
        });
    }
    
    for(var j = 1; j < 4; j++){
        $("#inventory" + "" + j).bind('click', function(){
            handleInv($(this));
        });
    }
    
    rollItems();
    
    $( "#itemInfo" ).text( goodLuck );
    
    
}

function itemChecker(o){
    for(var i = 0; i < inventory.length; i++){
        if(inventory[i] !== null){
            if(inventory[i].picture === o.picture)
                return false;
        }
    }
    return true;
}

function rollItems(){
    
    for(var i = 0; i < inventory.length; i++){
   
        var seed = Math.random();

        if(seed >= 0.5){
            inventory[i] = new kitty();
        }
        else if(seed < 0.5 && seed >= 0.25){
            var s = new sword();
            if(itemChecker(s)){
                inventory[i] = s;
            }
            else
                inventory[i] = new kitty();
        }
        else if(seed < 0.25 && seed >= 0.10){
            var w = new wand();
            if(itemChecker(w)){
                inventory[i] = w;
            }
            else
                inventory[i] = new kitty();
        }
        else{
            var sh = new shield();
            if(itemChecker(sh)){
                inventory[i] = sh;
            }
            else
                inventory[i] = new kitty();
        }
    }
}

function notOpenable(){
    
    var openables = 0;
    var openablesOpened = 0;
    
    try{
    
        for(var j = 0; j < levelToPlay.length; j++){

            if(levelToPlay[j] instanceof trsr && levelToPlay[j].guardian === null)
                openables++;

            else if(levelToPlay[j] instanceof trsr && levelToPlay[j].guardian.defeated === true)
                openables++;
        }

        for(var i = 0; i < levelToPlay.length; i++){

            if(levelToPlay[i] instanceof trsr && levelToPlay[i].guardian === null && levelToPlay[i].opened === true)
                openablesOpened++;
            else if(levelToPlay[i] instanceof trsr && levelToPlay[i].guardian.defeated === true && levelToPlay[i].opened === true)
                openablesOpened++;
        }
    
    }
    
    catch(error){}
    
    if(openables === openablesOpened)
        return true;
    else
        return false;
}

function trsrOpened(){
    for(var i = 0; i < levelToPlay.length; i++){
        if(levelToPlay[i] instanceof trsr){
            if(levelToPlay[i].opened === false)
                return false;
        }
    }
    return true;
}

function trsrRevealed(){
    for(var i = 0; i < levelToPlay.length; i++){
        if(levelToPlay[i] instanceof trsr){
            if(levelToPlay[i].revealed === false)
                return false;
        }
    }
    return true;
}

function enemyRevealed(){
    for(var i = 0; i < levelToPlay.length; i++){
        if(levelToPlay[i] instanceof dragon || levelToPlay[i] instanceof wizard || levelToPlay[i] instanceof skeleton){
            if(levelToPlay[i].revealed === false)
                return false;
        }
    }
    return true;
}

function roadRevealed(){
    try{
        for(var i = 0; i < levelToPlay.length; i++){
            if(levelToPlay[i] instanceof road){
                if(levelToPlay[i].revealed === false)
                    return false;
            }
        }
        return true;
    }
    catch(error){}
}

function invOpened(){
    if(inventoryRevealed === 3)
        return true;
    return false;
}

function isGameOver(){
    if(roadRevealed() && invOpened() && trsrOpened())
        return true;
    
    else if(roadRevealed() && invOpened() && trsrRevealed() && notOpenable())
        return true;
}

function gameOver(){

    exitInfo();
    reset();

}

function timer(){
    if(isGameOver())
        setTimeout(gameOver, 3500);
}

function reset(){
    
    inventory = [null, null, null];
    prize = 0;
    levelToPlay = null;
    
    $( ".img" ).remove();
            
    for(var i = 1; i < 50; i++){
        $("#box" + "" + i).unbind();
        $("#box" + "" + i).css("background-color", "#777777");
    }
    
    for(var j = 1; j < 4; j++){
        $("#inventory" + "" + j).unbind();
    }
    
    $("#gameArea").load(location.href+" #gameArea>*","");
    
    document.getElementById('gameArea').style.display = "none";

}

function exitInfo(){
          
    if(prize > 0)
        $( "#winnings" ).text( win + prize + cur );
    else
        $( "#winnings" ).text( noWin);
    
    $( "#modalButton" ).text( re );
    
    $( "#itemInfo" ).text( goodLuck );
    
    document.getElementById('myModal').style.display = "block";
}

function rollEnemy(){
    
    var seed = Math.random();
    
    if(seed > 0.75){
        var r = new road();
        return r;
    }
    else if(seed >= 0.5 && seed < 0.75){
        var d = new dragon();
        return d;
    }
    else if(seed < 0.5 && seed >= 0.20){
        var w = new wizard();
        return w;
    }
    else {
        var s = new skeleton();
        return s;
    }
}

function rollPrize(t){
    
    var seed = Math.random();
        
    if(seed >= 0.5){
        t.picture = "img/crateOpen0e.png";
        t.info = "Ei voittoa";
        t.prize = 0;
        prize += 0;
    }
    else if(seed < 0.5 && seed >= 0.30){
        t.picture = "img/crateOpen2e.png";
        t.info = "Voitit 2 euroa";
        t.prize = 2;
        prize += 2;
    }
    else if(seed < 0.3 && seed >= 0.20){
        t.picture = "img/crateOpen5e.png";
        t.info = "Voitit 5 euroa";
        t.prize = 5;
        prize += 5;
    }
    else if(seed < 0.2 && seed >= 0.15){
        t.picture = "img/crateOpen10e.png";
        t.info = "Voitit 10 euroa";
        t.prize = 10;
        prize += 10;
    }
    else if(seed < 0.15 && seed >= 0.10){
        t.info = "Voitit 20 euroa";
        t.picture = "img/crateOpen20e.png";
        t.prize = 20;
        prize += 20;
    }
    else if(seed < 0.10 && seed >= 0.6){
        t.picture = "img/crateOpen100e.png";
        t.info = "Voitit 100 euroa";
        t.prize = 100;
        prize += 100;
    }
    else if(seed < 0.06 && seed >= 0.02){
        t.picture = "img/crateOpen500e.png";
        t.info = "Voitit 500 euroa";
        t.prize = 500;
        prize += 500;
    }
    else {
        t.picture = "img/crateOpen5000e.png";
        t.info = "Voitit 5000 euroa";
        t.prize = 5000;
        prize += 5000;
    }
}

function enemyDefeating(){
    for(var i = 0; i < levelToPlay.length; i++){
        if(levelToPlay[i] instanceof dragon){
            for(var a = 0; a < inventory.length; a++){
                if(inventory[a] instanceof shield){
                    levelToPlay[i].defeated = true;
                }
            }
        }
        else  if(levelToPlay[i] instanceof skeleton){
            for(var a = 0; a < inventory.length; a++){
                if(inventory[a] instanceof sword){
                    levelToPlay[i].defeated = true;
                }
            }
        }
        else if(levelToPlay[i] instanceof wizard){
            for(var a = 0; a < inventory.length; a++){
                if(inventory[a] instanceof wand){
                    levelToPlay[i].defeated = true;
                }
            }
        }
    }
}

function playSound(o){
    var audio = new Audio( o.sound );
    audio.volume = 0.3;
    audio.play();
}

function playMusic(){
    
    var music = new Audio( "sound/music.mp3" );
    
    music.volume = 0.2;
    music.loop = true;
    
    music.play();
    
}

function handleInv(el){
    
    var index = el.attr('id');
    var i = "";
    
    for(var a = 0; a < index.length; a++){
        if(!(isNaN(index.charAt(a))))
            i += "" + index.charAt(a);
    }
    
    $( "#itemInfo" ).text( inventory[i - 1].info );
    
    playSound(inventory[i - 1]);
    
    $('#' + index).prepend('<img class="img" src=' + inventory[i - 1].picture  + ' />');
    
    inventoryRevealed++;
    
    $( "#" + index ).unbind();
   
}

function setGuardian(i){
    
    for(var i = 0; i < levelToPlay.length; i++){
        
        if(levelToPlay[i] instanceof trsr){
        
            if (i < 7){
                if(levelToPlay[i - 1] instanceof dragon || levelToPlay[i - 1] instanceof skeleton || levelToPlay[i - 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i - 1];
                else if(levelToPlay[i + 1] instanceof dragon || levelToPlay[i + 1] instanceof skeleton || levelToPlay[i + 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i + 1];
                else if(levelToPlay[i + 7] instanceof dragon || levelToPlay[i + 7] instanceof skeleton| levelToPlay[i + 7] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i + 7];
            }
            
            else if(i > 42){
                if(levelToPlay[i - 1] instanceof dragon || levelToPlay[i - 1] instanceof skeleton || levelToPlay[i - 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i - 1];
                else if(levelToPlay[i + 1] instanceof dragon || levelToPlay[i + 1] instanceof skeleton || levelToPlay[i + 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i + 1];
                else if(levelToPlay[i - 7] instanceof dragon || levelToPlay[i - 7] instanceof skeleton || levelToPlay[i - 7] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i - 7];
            }
            
            else{
                if(levelToPlay[i - 1] instanceof dragon || levelToPlay[i - 1] instanceof skeleton || levelToPlay[i - 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i - 1];
                else if(levelToPlay[i + 1] instanceof dragon || levelToPlay[i + 1] instanceof skeleton || levelToPlay[i + 1] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i + 1];
                else if(levelToPlay[i + 7] instanceof dragon || levelToPlay[i + 7] instanceof skeleton| levelToPlay[i + 7] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i + 7];
                else if(levelToPlay[i - 7] instanceof dragon || levelToPlay[i - 7] instanceof skeleton || levelToPlay[i - 7] instanceof wizard)
                    levelToPlay[i].guardian = levelToPlay[i - 7];
            }
        }
    }
}

function handleBox(el){
          
    var index = el.attr('id');
    var i = "";
    
    $("#" + index).css("background-color", "#333333");
    
    for(var a = 0; a < index.length; a++){
        if(!(isNaN(index.charAt(a))))
            i += "" + index.charAt(a);
    }
    
    levelToPlay[i - 1].revealed = true;
    
    if(!(levelToPlay[i - 1] instanceof trsr))
        playSound(levelToPlay[i - 1]);
    
    if(levelToPlay[i - 1] instanceof trsr){
        
        levelToPlay[i - 1].clicks += 1;
        
        if(invOpened())
            enemyDefeating();
     
        if(levelToPlay[i - 1].clicks === 1){
            
            playSound(levelToPlay[i - 1]);
            $('#' + index).prepend('<img id = "img' + index + '" class="img" src=img/crateClosed.png>');
            $( "#itemInfo" ).text( treasure );
            
        }
        
        else if(levelToPlay[i - 1].guardian === null || levelToPlay[i - 1].guardian.defeated === true ){
          
            levelToPlay[i - 1].sound = "sound/crateOpening.mp3";
            playSound(levelToPlay[i - 1]);
            
            levelToPlay[i - 1].opened = true;
            
            $("#img" + index).attr("src", levelToPlay[i - 1].picture);
            $( "#itemInfo" ).text( levelToPlay[i - 1].info );
            $( "#" + index ).unbind();
                       
        }
        
        else{
            levelToPlay[i - 1].sound = "sound/crateLocked.mp3";
            playSound(levelToPlay[i - 1]);
        }
        
    }
    
    else{
        
        $('#' + index).prepend('<img class="img" src=' + levelToPlay[i - 1].picture + ' />');
        $( "#itemInfo" ).text( levelToPlay[i - 1].info );
        $( "#" + index ).unbind();
        
    }
}

function run(){
    
     document.getElementById('myModal').style.display = "none";
     document.getElementById('gameArea').style.display = "block";
     
     if(runs === 1)
        playMusic();
     
     runs++;
     
     gameLevel();
}

var level1 = ['wall', 'wall', 'road', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'road', 'road', 'enmy', 'trsr', 'wall',
              'wall', 'wall', 'road', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'road', 'road', 'road', 'wall', 'wall',
              'wall', 'wall', 'road', 'wall', 'enmy', 'wall', 'wall',
              'wall', 'trsr', 'enmy', 'wall', 'trsr', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
          
var level2 = ['wall', 'wall', 'wall', 'wall', 'wall', 'road', 'wall',
              'wall', 'wall', 'trsr', 'enmy', 'road', 'road', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'road', 'wall',
              'wall', 'wall', 'road', 'road', 'road', 'road', 'wall',
              'wall', 'wall', 'enmy', 'wall', 'enmy', 'wall', 'wall',
              'wall', 'wall', 'trsr', 'wall', 'trsr', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
          
var level3 = ['wall', 'wall', 'wall', 'road', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'road', 'enmy', 'trsr', 'wall',
              'wall', 'road', 'road', 'road', 'wall', 'wall', 'wall',
              'wall', 'road', 'wall', 'road', 'wall', 'trsr', 'wall',
              'wall', 'enmy', 'wall', 'road', 'road', 'enmy', 'wall',
              'wall', 'trsr', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
          
var level4 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'road', 'road', 'road', 'road', 'road', 'road',
              'wall', 'road', 'wall', 'road', 'wall', 'enmy', 'wall',
              'wall', 'road', 'wall', 'road', 'wall', 'trsr', 'wall',
              'wall', 'enmy', 'wall', 'enmy', 'trsr', 'wall', 'wall',
              'wall', 'trsr', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
       
var level5 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'trsr', 'wall', 'wall', 'trsr', 'wall',
              'wall', 'wall', 'enmy', 'road', 'wall', 'enmy', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'road', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'road', 'wall',
              'wall', 'trsr', 'enmy', 'road', 'road', 'road', 'road',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
        
var level6 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'trsr', 'enmy', 'road', 'wall', 'trsr', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'enmy', 'wall',
              'wall', 'trsr', 'enmy', 'road', 'road', 'road', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'wall', 'wall',
              'road', 'road', 'road', 'road', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
          
var level7 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'trsr', 'wall', 'road', 'road', 'enmy', 'wall',
              'wall', 'enmy', 'wall', 'road', 'wall', 'trsr', 'wall',
              'road', 'road', 'road', 'road', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'trsr', 'wall',
              'wall', 'wall', 'wall', 'road', 'road', 'enmy', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
          
var level8 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'trsr', 'enmy', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'road', 'wall', 'wall', 'wall', 'wall',
              'wall', 'road', 'road', 'road', 'road', 'road', 'road',
              'wall', 'enmy', 'wall', 'wall', 'road', 'wall', 'wall',
              'wall', 'trsr', 'wall', 'wall', 'enmy', 'trsr', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
        
var level9 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
              'road', 'road', 'road', 'road', 'enmy', 'trsr', 'wall',
              'wall', 'wall', 'wall', 'road', 'wall', 'wall', 'wall',
              'wall', 'road', 'road', 'road', 'wall', 'wall', 'wall',
              'wall', 'enmy', 'wall', 'road', 'enmy', 'trsr', 'wall',
              'wall', 'trsr', 'wall', 'wall', 'wall', 'wall', 'wall',
              'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];
   
var level10 = ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
               'wall', 'wall', 'wall', 'road', 'enmy', 'trsr', 'wall',
               'wall', 'trsr', 'enmy', 'road', 'wall', 'wall', 'wall',
               'wall', 'wall', 'wall', 'road', 'enmy', 'trsr', 'wall',
               'road', 'road', 'road', 'road', 'wall', 'wall', 'wall',
               'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall',
               'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'];