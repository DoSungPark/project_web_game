var deck = ["1a","1b","1c","1d","2a","2b","2c","2d","3a","3b","3c","3d","4a","4b","4c","4d","5a","5b","5c","5d",
            "6a","6b","6c","6d","7a","7b","7c","7d","8a","8b","8c","8d","9a","9b","9c","9d","0a","0b","0c","0d",
            "ja","jb","jc","jd","qa","qb","qc","qd","ka","kb","kc","kd"];
 
var card=[];
var rst = [];
var suffle_sound = new Audio("" ) ;
var draw_sound = new Audio("");
var betting_sound = new Audio("");
var hit_sound = new Audio("");
var stay_sound = new Audio("");
var bust_sound = new Audio("");
var win_sound = new Audio("");
var lose_sound = new Audio("");

// 랜덤하게 추출 (array Ver)
function getRandom(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}
 
function getRandomArray(min, max, count) {
 
  while (1) {
    var index = getRandom(min, max);
    // 중복 여부를 체크
    if (rst.indexOf(index) > -1) {
        continue;
      }
    rst.push(index);
    // 원하는 배열 갯수가 되면 종료
    if (rst.length == count) {
        break;
      }
  }
 
  return rst;
}
 
function shuffle(){ //카드 셔플
  suffle_sound.play();
  getRandomArray(0,deck.length-1,deck.length);
  for (var i = 0; i < deck.length ; i++) {
    card.push(deck[rst.pop()]);
  }
 
}
 
 
 
var player_card=[]; //플레이어 보유 카드
var dealer_card=[];  //딜러 보유 카드
var count= 0;
var dealer_burst=0;
var player_burst=0;
var score =500;
function player_draw(){   //플레이어 카드 1장 뽑기
  player_card.push(card[count++]);
  cal_player(0);
}
 
function dealer_draw(){  //딜러 카드 1장 뽑기
  draw_sound.play();
  var num = parseInt(cal_deler(0));
  if (num < 17){
    dealer_card.push(card[count++]); /// 17 미만이면 더 뽑기
    cal_deler(0);
  }
 
 
}
function player_card_show(){  //플레이어 카드 보여주기
  var adu = document.getElementById("player_board");
  while ( adu.hasChildNodes() )
  {
    adu.removeChild( adu.firstChild );  //플레이어 필드의 카드 제거
  }
  for (var i = 0; i < player_card.length; i++) {    //player_card 에 있는 카드들 차례대로 출력
    var div = document.createElement("div");
    div.id = "player"+i;
    //div.innerHTML = player_card[i];
    div.style.backgroundImage = "url('media/"+player_card[i]+".png')";
    div.style.backgroundSize = "120px 180px";
    adu.appendChild(div);
  }
}
function dealer_card_show(num){  // 딜러 카드 보여주기
  var adu = document.getElementById("deler_board");
  while ( adu.hasChildNodes() )
  {
    adu.removeChild( adu.firstChild );  //딜러 필드의 카드 제거
  }
  if (num == 1){    // 딜러의 첫번째 카드는 뒷면으로 하고, 결과 출력시 앞면 보여주기
    var div = document.createElement("div");
    div.id = "com"+0;
    //div.innerHTML = dealer_card[0];
    div.style.backgroundImage = "url('media/back.png')";
    div.style.backgroundSize = "120px 180px";
    adu.appendChild(div);
  }
  for (var i = num; i < dealer_card.length; i++) {   //dealer_card 에 있는 카드들 차례대로 출력
    var div = document.createElement("div");
    div.id = "com"+i;
  //  div.innerHTML = dealer_card[i];
    div.style.backgroundImage = "url('media/"+dealer_card[i]+".png')";
    div.style.backgroundSize = "120px 180px";
    adu.appendChild(div);
  }
}



function new_start(){ //다시시작
  shuffle();
  setTimeout(turn,1000);
}



function turn(){  // 턴 시작  플레이어, 딜러 카드 2장씩 뽑기
  player_card = [];
  dealer_card = [];
  dealer_burst=0;
  player_burst=0;
  player_draw();
  dealer_draw();
  player_draw();
  dealer_draw();
  player_card_show();
  dealer_card_show(1);
  document.getElementById('start').style.display = "none";    //시작 버튼 삭제
  document.getElementById('gaming').style.display = "block";  // 게임 버튼 보여주기
  document.getElementById('restart').style.display = "none";  //다시 시작 버튼 삭제
  //document.getElementById('com_num_board').style.display = "none";
 
}

/* 덱보기기능

function view() {
  viewer.innerHTML = card.slice(count,card.length);
}

*/
 
function player_burst(){    //플레이어 버스트 확인
  if(player_burst==0){
    player_burst=1;
    lose_sound.play();
    alert("플레이어가 버스트 되었습니다ㅠㅠ");
    score-=100;
    player_card_show();
    dealer_card_show(0);
    setTimeout(end,100);
  }
}
 
function alert_dealer_burst(){
  var player_num = cal_player(0);
 
  alert("딜러가 버스트 되었습니다!");
  if(player_num==21){
    callaudio.play();
    score+=100;
    alert("플레이어가 ♠블랙잭♠ 성공!");
  }
  else if(player_num>21&&player_burst==0){
    player_burst=1;
    score-=100;
    alert("플레이어가 버스트 되었습니다ㅠㅠ");
  }
  else {
    callaudio.play();
  }
}
 
function deler_burst(){ //딜러 버스트 확인
  dealer_card_show(0);
  if(dealer_burst==0){
    score+=100;
    setTimeout(alert_dealer_burst,100);
 
    dealer_burst=1;
  }
  dealer_card_show(0);
  setTimeout(end,300);
}
function cal_player(ace){ //플레이어 카드 합 계산
  var num = 0;
  if(ace==0){
    for (var i = 0; i < player_card.length; i++) {
      if(player_card[i][0]=='0'||player_card[i][0]=='j'||player_card[i][0]=='q'||player_card[i][0]=='k'){
        num+=10;
      }
      else if (player_card[i][0]=='1') {    //A는 11로 계산 한 다음 합이 21이 넘으면 1로 계산
        num+=11;
      }
      else{
        num += parseInt(player_card[i][0]);
      }
    }
    var player_num = document.getElementById('player_num');
    player_num.value = num;
    if(num>21){
      return cal_player(1);
    }
  }
if(ace==1){
    for (var i = 0; i < player_card.length; i++) {
      if(player_card[i][0]=='0'||player_card[i][0]=='j'||player_card[i][0]=='q'||player_card[i][0]=='k'){
        num+=10;
      }
      else{
        num += parseInt(player_card[i][0]);
      }
    }
    var player_num = document.getElementById('player_num');
    player_num.value = num;
    if(num>21){
      setTimeout(player_burst,100);
    }
  }
  return num;


}
 
function cal_deler(ace){    //딜러 합 계산
  var num = 0;
  if(ace==0){
    for (var i = 0; i < dealer_card.length; i++) {
      if(dealer_card[i][0]=='0'||dealer_card[i][0]=='j'||dealer_card[i][0]=='q'||dealer_card[i][0]=='k'){
        num+=10;
      }
      else if (dealer_card[i][0]=='1') {   //A는 11로 계산 한 다음 합이 21이 넘으면 1로 계산
        num+=11;
      }
      else{
        num += parseInt(dealer_card[i][0]);
      }
    }
    var deler_num = document.getElementById('deler_num');
    deler_num.value = num;
    if(num>21){
 
      return cal_deler(1);
    }
  }
  if(ace==1){
    for (var i = 0; i < dealer_card.length; i++) {
      if(dealer_card[i][0]=='0'||dealer_card[i][0]=='j'||dealer_card[i][0]=='q'||dealer_card[i][0]=='k'){
        num+=10;
      }
      else{
 
        num += parseInt(dealer_card[i][0]);
      }
    }
    var deler_num = document.getElementById('deler_num');
    deler_num.value = num;
 
  }
  return num;
}
 



function pick(){    // 카드 뽑기 선택
  player_draw();
  player_card_show();
  dealer_draw();
  dealer_card_show(1);
  var com_num = cal_deler(0);
  if(com_num>21){
    setTimeout(deler_burst,100);
    dealer_card_show(0);
  }
}


function hit_to(){   //히트 선택
  dealer_card_show(0);
  setTimeout(hit,100);
}


function hit(){  //히트 기능
  var player_num = cal_player(0);
  var com_num = cal_deler(0);
  player_card_show();
  dealer_card_show(0);   //딜러 카드 오픈
 
  if(com_num>21){
    setTimeout(deler_burst,100);    //딜러 버스트 확인
    dealer_card_show(0);
  }
  else if(com_num < 17){    //딜러 17 미만시 드로우 하기
    dealer_draw();
    dealer_card_show(0);
    setTimeout(hit,300);
    return;
  }
 
  else{
    if(player_num==21){             //플레이어 블랙잭 확인
      score+=100;
      alert("플레이어가 ♠블랙잭♠ 성공!");
    }
    dealer_card_show(0);
    if(com_num > 21 && player_num>21){      //플레이어 딜러 둘다 블랙잭일 경우
      alert("무승부");
    }
    if(com_num==21){      //딜러 블랙잭 확인
      score-=100;
      alert("딜러의 블랙잭 성공으로 패배합니다.");
    }
 
    if((player_num>com_num&&player_num<22)||com_num>21){    //플레이어 승
      callaudio.play();
      score+=100;
      alert("플레이어 승리 v^^v");
    }
    else if((player_num<com_num&&com_num<22)||player_num>21){   //플레이어 패
    lose_sound.play();
      score-=100;
      alert("플레이어 패배 ㅠ.ㅠ");
    }
    else{
      alert("무승부");    //무승부
    }
    setTimeout(end,100);
  }
}


/* 포기 기능

function give_up(){   //포기
  alert("give_up");
  score-=50;
  player_card_show();
  dealer_card_show(0);
  setTimeout(end,100);

}
*/

function end(){   //턴 종료
 
  player_card_show();
  dealer_card_show(0);
  var player_score = document.getElementById('player_score');
  player_score.value = score;
 
  document.getElementById('restart').style.display = "block";   //다시하기 버튼 보여주기 ( 혹은 베팅 버튼 )
  document.getElementById('gaming').style.display = "none";     //게임 버튼 삭제
  //document.getElementById('com_num_board').style.display = "block";


  if(card.length-count<10){                             // 남은 카드가 10장 미만인 경우 게임 종료
    winaudio.play();
    alert("게임 종료");
    player_score=500;
    document.getElementById('restart').style.display = "none"; // 다시하기 버튼 삭제
    document.getElementById('start').style.display = "block"; // 시작 버튼 보여주기
  }
}