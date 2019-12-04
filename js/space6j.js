
        /*
        enemyShipArr에 속성을 추가하면 더 세분화된 적 객체를 생성할 수 있음
        ex)
        var enemy={
            x : pos, y : 10, type:1, hp:100
        }
        */
        var bg1 = new Image();
        var bg2 = new Image();
        var myship = new Image();
        var missile1 = new Image();
        var missile2 = new Image();
        var enemyShip = new Image();
        shipImg = [];
        missileArr = [];
        missileEnemyArr = [];
        bg1.src = "../images/canvas/space.jpg";
        bg2.src = "../images/canvas/space.jpg";
        missile1.src = "../images/canvas/missile.png";
        missile2.src = "../images/canvas/missile1.png";
        for (var i = 0; i < 8; i++) {
            shipImg[i] = "../images/canvas/gunship" + i + ".png";
        }

        var bgSound = new Audio("../sounds/Burning_Body.mp3");
        var fireSound = new Audio("../sounds/fire2.wav");
        var downSound = new Audio("../sounds/sfx_sounds_falling5.wav");

        var enemyShipArr = [];
        var misArr = [];
        var misArrL = [];

        var bg1Y = 0;
        var bg2Y = 600;
        var myShipX = 200;
        var myShipY = 520;
        var missileX = -150;
        var missileY = -150;

        var shipSize = 50;

        var bgSpd = 1.85;
        var missileSpd = 2.5;
        var counter1 = 0;
        var stage_flag = 0;
        var ArrX1;
        var ArrY1;
        var score = 0;
        var cntM = 0;

        var life = 5; //999999;

        var rVx = Math.random() * 5;
        var rVy = Math.random() * 5;

        var ctx;
        var canvas;

        window.onload = function() {
            canvas = document.querySelector(".myCanvas");
            ctx = canvas.getContext("2d");
            ctx.drawImage(bg1, 0, bg1Y, 600, 800);
            ctx.drawImage(bg2, 0, bg2Y, 600, 800);
            setInterval(drawCtx, 10);

            document.body.onkeydown = keyHandler;

            canvas.addEventListener("mousemove", mouseoverHandler);
            canvas.addEventListener("click", mouseclickHandler);
            canvas.addEventListener("wheel", mouseclickHandler);

            initialDrawEnemyGunship(); // 적기 초기화 7대

            // canvas.addEventListener("dragover", mouseclickHandler); //드래그가 안먹어 ㅠㅠ
        }

        function drawCtx() { // 지속적으로 실행되는 drawCtx 함수
            counter1++;
            bg1Y -= bgSpd;
            bg2Y -= bgSpd;
            missileY -= missileSpd;
            if (bg2Y <= 0) {
                bg1Y = 0;
                bg2Y = 800;
            }
            ctx.drawImage(missile2, 150, 400, 150, 150);
            ctx.drawImage(bg1, 0, bg1Y, 600, 800);
            ctx.drawImage(bg2, 0, bg2Y, 600, 800);

            drawMissile(); // 발사되는 미사일그리기                
            drawMyGunship(); // 내 건쉽

            if (counter1 % 150 == 0) {
                makeMissileEnemyArr(); // 상대방 미사일
            }
            drawEnemyMissile(); // 상대방 미사일 그리기

            moveEnemyGunShip(); // 상대방 건쉽 좌표 움직임
            drawEnemyGunship(); // 상대방 건쉽
            ablePositionCheck(); // 화면내에서만 그리기

            targetDownCheck(); // 미사일과 충돌하였는지
            gameOver();

            ctx.fillStyle = "lime"; //"dodgerblue";
            ctx.font = "25px bold 고딕";
            ctx.fillText("stage : " + (stage_flag + 1), 10, 30);

            ctx.fillStyle = "dodgerblue"; //"dodgerblue";
            ctx.font = "25px bold 고딕";
            ctx.fillText("score : " + score * 100, 10, 60);
            ctx.fillText("enemy : " + enemyShipArr.length, 10, 90);
            ctx.fillText("[test] y     : " + Math.abs(Math.sin(((counter1 / 100) % 360)) * 1), 10, 760);
            ctx.fillText("[test] +dy : " + Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100, 10, 790);
            ctx.fillStyle = "pink";
            ctx.fillText("life : " + life, 10, 730);

        }

        function moveEnemyGunShip() {
            if (stage_flag < 4) {
                for (var i = 0; i < enemyShipArr.length; i++) {
                    // abs ( sin(x/70)*cosh(x/70)*100 )
                    // enemyShipArr[i].x += Math.cos(counter1%210/70)*Math.sinh(counter1%210/70)*1;
                    enemyShipArr[i].y += Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100;
                    // console.log(Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100);
                    // console.log(enemyShipArr[i].y);
                    if ((counter1 / 10) % 360 < 180) {
                        enemyShipArr[i].x -= Math.cos(((counter1 / 100) % 360)) * 1;
                        enemyShipArr[i].y += Math.abs(Math.sin(((counter1 / 100) % 360)) * 1);
                    } else {
                        enemyShipArr[i].x -= Math.cos(((counter1 / 100) % 360)) * 1;
                        enemyShipArr[i].y += Math.abs(Math.sin(((counter1 / 100) % 360)) * 1);
                    }
                }
            } else if (stage_flag < 8) {
                for (var i = 0; i < enemyShipArr.length; i++) {
                    enemyShipArr[i].y += Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100;
                    var divideC = Math.random() * 100;
                    if ((counter1 / 1) % 360 < 240) {
                        // console.log(Math.abs((((counter1/divideC) % 360)/100) * rVy)*(1.2)+0.1);
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 + rVx / 3;
                        enemyShipArr[i].y += (Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (1.5) + 0.1) % 3;
                    } else if ((counter1 / 1) % 360 < 300 - (rVx * 10)) {
                        // console.log(Math.cos(((counter1/divideC) % 360 )));
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 + rVx / 2;
                        enemyShipArr[i].y += Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (0.5);
                    } else if ((counter1 / 1) % 360 < 300 + 50) {
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 - rVx;
                        enemyShipArr[i].y += Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (0.5);
                    } else {
                        if (i != 0) { // 뭉치기
                            var px = pythagoras(enemyShipArr[i].x, enemyShipArr[i].y,
                                enemyShipArr[i - 1].x, enemyShipArr[i - 1].y);
                            enemyShipArr[i].x -= px / 100;
                            enemyShipArr[i].y += 0.0;
                        }
                    }
                }

            } else {
                for (var i = 0; i < enemyShipArr.length; i++) {
                    enemyShipArr[i].y += Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100;
                    var divideC = Math.random() * 100;
                    if ((counter1 / 1) % 360 < 240) {
                        // console.log(Math.abs((((counter1/divideC) % 360)/100) * rVy)*(1.2)+0.1);
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 + rVx / 3;
                        enemyShipArr[i].y += (Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (1.5) + 0.1) % 3;
                    } else if (counter1 % 10 == 0) {
                        if (i != 0) { // 뭉치기
                            // console.log("뭉치기!");
                            var px = pythagoras(enemyShipArr[i].x, enemyShipArr[i].y,
                                enemyShipArr[i - 1].x, enemyShipArr[i - 1].y);
                            enemyShipArr[i].x -= px / 50;
                            enemyShipArr[i].y += 0.01;
                        }
                    } else if ((counter1 / 1) % 360 < 300 - (rVx * 10)) {
                        // console.log(Math.cos(((counter1/divideC) % 360 )));
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 + rVx / 2;
                        enemyShipArr[i].y += Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (0.5);
                    } else {
                        enemyShipArr[i].x -= Math.cos(((counter1 / divideC) % 360)) * rVx / 3 - rVx;
                        enemyShipArr[i].y += Math.abs((((counter1 / divideC) % 360) / 100) * rVy) * (0.5);
                    }
                }
                // for (var i = 0; i < enemyShipArr.length; i++) {
                //     // abs ( sin(x/70)*cosh(x/70)*100 )
                //     // enemyShipArr[i].x += Math.cos(counter1%210/70)*Math.sinh(counter1%210/70)*1;
                //     enemyShipArr[i].y += Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100;
                //     // console.log(Math.sin(counter1 % 420 / 70) * Math.cosh(counter1 % 420 / 70) * 1 / 100);
                //     // console.log(enemyShipArr[i].y);
                //     if ((counter1 / 10) % 360 < 180) {
                //         enemyShipArr[i].x -= Math.cos(((counter1 / 100) % 360)) * 1;
                //         enemyShipArr[i].y += Math.abs(Math.sin(((counter1 / 100) % 360)) * 1);
                //     } else if((counter1 / 10) % 360 < 180){
                //         enemyShipArr[i].x -= Math.cos(((counter1 / 100) % 360)) * 1;
                //         enemyShipArr[i].y += Math.abs(Math.sin(((counter1 / 100) % 360)) * 1);
                //     } else{
                //         if(i!=0){   // 뭉치기
                //             var px = pythagoras(enemyShipArr[i].x, enemyShipArr[i].y, 
                //             enemyShipArr[i-1].x, enemyShipArr[i-1].y);
                //             enemyShipArr[i].x -= px/100;
                //             enemyShipArr[i].y += 0.0;
                //         }
                //     }

                // }
            }
        }

        function gameOver() {
            if (life <= 0) {
                canvas.removeEventListener("mousemove", mouseoverHandler);
                canvas.removeEventListener("click", mouseclickHandler);
                canvas.removeEventListener("wheel", mouseclickHandler);
                ctx.fillStyle = "red";
                ctx.font = "90px 고딕"
                ctx.fillText("GAME OVER", 50, 300);
                ctx.font = "15px 고딕"
                ctx.fillText("Please Insert Coin", 230, 400)
                life = 0;
            }
        }
        //---------------------- Event Handler Start-----------------------//
        function keyHandler(e) {
            // console.log(e);  
            switch (e.code) {
                case "KeyA":
                    myShipX -= 10;
                    break;
                case "KeyD":
                    myShipX += 10;
                    break;
                case "KeyW":
                    myShipY -= 10;
                    break;
                case "KeyS":
                    myShipY += 10;
                    break;
                case "Space":
                    //미사일발사
                    break;
                case "KeyX":
                    if (life == 0) {
                        life++;
                        score = 0;
                        canvas.addEventListener("mousemove", mouseoverHandler);
                        canvas.addEventListener("click", mouseclickHandler);
                        canvas.addEventListener("wheel", mouseclickHandler);
                    }
                    break;
            }
        }

        function mouseclickHandler(e) {
            fireSound.currentTime = 0;
            fireSound.play();
            missileX = e.pageX;
            missileY = e.pageY;
            makeMissileArr();
        }

        function mouseoverHandler(e) {
            // console.log(e);
            myShipX = e.pageX - shipSize / 2;
            myShipY = e.pageY - shipSize / 2;
        }

        //---------------------- Event Handler End-------------------------//

        function makeMissileArr() {
            var fix = 0;
            cntM++;
            if (cntM % 2 == 0) {
                fix = -25;
            } else {
                fix = 25;
            }
            // if(cntM%3==0){
            //     fix = -25;
            // }else if(cntM%3==1){
            //     fix = 0;
            // }else{
            //     fix = 25;
            // }

            // for(var i = 0 ; i < 3; i ++){
            //     if(i%3==0){
            //         fix = -25;
            //     }else if(i%3==1){
            //         fix = 0;
            //     }else{
            //         fix = 25;
            //     }
            var h = {
                x: missileX + fix,
                y: missileY
            }
            missileArr.push(h);
            // }
            // console.log(missileArr);
            drawMissile();

        }

        // enemy
        function makeMissileEnemyArr() {

            for (var i = 0; i < enemyShipArr.length; i++) {
                var h = {
                    x: enemyShipArr[i].x,
                    y: enemyShipArr[i].y
                }
                missileEnemyArr.push(h);
            }
        }

        function drawEnemyMissile() {
            for (var i = 0; i < missileEnemyArr.length; i++) {
                ctx.drawImage(missile2, missileEnemyArr[i].x + shipSize / 2 - 2.5, missileEnemyArr[i].y + shipSize / 2 - 7.5, 5, 15);
                missileEnemyArr[i].y += 10;
                if (missileEnemyArr[i].y > 800) {
                    missileEnemyArr.splice(i, 1);
                }
            }
        }
        //

        function drawMissile() {
            for (var i = 0; i < missileArr.length; i++) {
                ctx.drawImage(missile2, missileArr[i].x, missileArr[i].y, 5, 15);
                missileArr[i].y -= 10;
                if (missileArr[i].y < 0) {
                    missileArr.splice(i, 1);
                }
            }
        }

        function targetDownCheck() {

            if (enemyShipArr.length > 0) {
                // console.log(enemyShipArr.length);
                for (var i = 0; i < enemyShipArr.length; i++) { // 적기와의 충돌
                    var mydis = pythagoras(enemyShipArr[i].x + shipSize / 2, enemyShipArr[i].y + shipSize / 2,
                        myShipX + shipSize / 2, myShipY + shipSize / 2)
                    // console.log(mydis);
                    if (mydis < 15) { // my Gunship is down
                        // console.log("boom"+i);
                        // console.log("my Gunship is down");
                        enemyShipArr.splice(i, 1);
                        if (enemyShipArr.length == 0) {
                            stage_flag++;
                        }
                        life--;
                        downSound.currentTime = 0;
                        downSound.play();
                    }
                    if (life > 0) {
                        for (var k = 0; k < missileEnemyArr.length; k++) { // 적 미사일에 격추당함
                            var mydis2 = pythagoras(missileEnemyArr[k].x + shipSize / 2, missileEnemyArr[k].y + shipSize / 2,
                                myShipX + shipSize / 2, myShipY + shipSize / 2)
                            if (mydis2 <= 15) {
                                // console.log("격추당함");
                                missileEnemyArr.splice(k, 1);
                                life--;
                                downSound.currentTime = 0;
                                downSound.play();
                            }
                        }
                    }

                    for (var j = 0; j < missileArr.length; j++) { // 적기를 격추함
                        var dis = pythagoras(enemyShipArr[i].x + shipSize / 2, enemyShipArr[i].y + shipSize / 2,
                            missileArr[j].x + 2.5, missileArr[j].y + 7.5);
                        // 2.5 7.5 is missileSize/2
                        if (dis < 15) { // enemy Gunship is down
                            enemyShipArr.splice(i, 1);
                            missileArr.splice(j, 1);
                            downSound.currentTime = 0;
                            downSound.play();
                            score++;
                            if (enemyShipArr.length == 0) {
                                stage_flag++;
                            }
                            break;
                        }
                    }
                }
            } else {
                rVx = Math.random() * 5;
                rVy = Math.random() * 5;
                switch (stage_flag) {
                    case 1:
                        console.log("1111111111111111111111111111");
                        // enemyShipArr.shift();
                        // enemyShipArr.splice(0, enemyShipArr.length);
                        // setTimeout(() => {
                        // }, 500);
                        var arrX1;
                        var arrY1;
                        for (var i = 0; i < 8; i++) {
                            if (i % 2 == 0) {
                                arrX1 = 150.1;
                            } else {
                                arrX1 = 350.1;
                            }
                            arrY1 = -130 + 50.1 * i;
                            generatorEnemyGunship(i, arrX1, arrY1);
                            console.log(enemyShipArr);
                        }
                        break;
                    case 2:
                        console.log("222222222222222222222222222222222");
                        // enemyShipArr.shift();
                        // enemyShipArr.splice(0, enemyShipArr.length);
                        console.log(enemyShipArr.length);
                        // setTimeout(() => {
                        // }, 500);
                        var arrX1;
                        var arrY1;
                        for (var i = 0; i < 10; i++) {
                            if (i < 5) {
                                arrX1 = (i * 50);
                                arrY1 = (i * 50);
                            } else {
                                arrX1 = (600 - i * 50);
                                arrY1 = ((i - 5) * 50);
                            }
                            generatorEnemyGunship(i, arrX1, arrY1);
                            console.log(i + "|" + arrX1 + "|" + arrY1);
                            // console.log(enemyShipArr.length);
                            // console.log(enemyShipArr[i].x+"|"+enemyShipArr[i].y);

                            // ArrX1.push(Math.floor(Math.random()*500));
                            // ArrY1.push(Math.floor((-200+Math.random()*200)));
                        }
                        console.dir(enemyShipArr);
                        break;
                    case 3:
                        var arrX1;
                        var arrY1;
                        for (var i = 0; i < 20; i++) {
                            if (i < 10) {
                                arrX1 = (i * 10);
                                arrY1 = (i * 30 - 100);
                            } else {
                                arrX1 = (600 - i * 10);
                                arrY1 = ((i - 5) * 30 - 100);
                            }
                            generatorEnemyGunship(i, arrX1, arrY1);
                        }
                        console.dir(enemyShipArr);
                        break;

                    case 4:
                        console.log("1111111111111111111111111111");
                        // enemyShipArr.shift();
                        // enemyShipArr.splice(0, enemyShipArr.length);
                        // setTimeout(() => {
                        // }, 500);
                        var arrX1;
                        var arrY1;
                        for (var i = 0; i < 16; i++) {
                            if (i < 8) {
                                if (i % 2 == 0) {
                                    arrX1 = 150;
                                } else {
                                    arrX1 = 350;
                                }
                            } else {
                                if (i % 2 == 0) {
                                    arrX1 = 250;
                                } else {
                                    arrX1 = 450;
                                }
                            }

                            arrY1 = -130 + 30 * i;
                            generatorEnemyGunship(i, arrX1, arrY1);
                            // console.log(enemyShipArr);
                        }
                        break;
                    case 5:
                        for (var i = 0; i < 20; i++) {
                            var h = {
                                x: 35,
                                y: -30
                            };
                            h.x = Math.cos(i) * 100 + 300;
                            h.y = Math.sin(i) * 100 + 10;
                            // h.y = i<50?(i)*2:(-i)*5;
                            enemyShipArr.push(h);
                        }
                        break;
                    case 6:
                        for (var i = 0; i < 20; i++) {
                            var h = {
                                x: 35,
                                y: -30
                            };
                            if(i%3==0){
                                h.x = Math.cos(i) * 100 + 300;
                                h.y = Math.sin(i) * 100 -00;
                            }else if(i%3==1){
                                h.x = Math.cos(i) * 200 + 300;
                                h.y = Math.sin(i) * 100 - 00;
                            }else{
                                h.x = Math.cos(i) * 300 + 300;
                                h.y = Math.sin(i) * 100 - 00;
                            }
                            // h.y = i<50?(i)*2:(-i)*5;
                            enemyShipArr.push(h);
                        }
                        break;

                        case 7://이건별로임 귀찮으니 냅둠
                        for (var i = 0; i < 100; i++) {
                            var h = {
                                x: 35,
                                y: -30
                            };
                            if(i%3==0){
                                h.x = Math.cos(i) * 100 + 300;
                                h.y = Math.sin(i) * 100 -50;
                            }else if(i%3==1){
                                h.x = Math.cos(i) * 200 + 300;
                                h.y = Math.sin(i) * 200 - 50;
                            }else{
                                h.x = Math.cos(i) * 300 + 300;
                                h.y = Math.sin(i) * 300 - 50;
                            }
                            h.y = i<50?(i)*2:(-i)*5;
                            enemyShipArr.push(h);
                        }
                        break;


                    default:
                        // setTimeout(() => {}, 500);
                        randomDrawEnemyGunship();
                }
                // stage_flag++;
            }
        }

        function pythagoras(x1, y1, x2, y2) {
            return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        }

        function drawMyGunship() {
            if (counter1 % 43 == 0) { // 소수와의 공배수마다 한번씩 (느리게 이미지 변하게)
                myship.src = shipImg[7 - counter1 % 4];
            }
            ctx.drawImage(myship, myShipX, myShipY, shipSize, shipSize);
        }

        function initialDrawEnemyGunship() {
            for (var i = 0; i < 7; i++) {
                var h = {
                    x: 35,
                    y: -30
                };
                // if(enemyShipArr.length < 7){
                h.x = 35 + i * 80;
                // h.x = Math.random()*600;
                // h.y = Math.random()*(-300);
                enemyShipArr.push(h);
            }



        }

        function randomDrawEnemyGunship() {
            for (var i = 0; i < 4 + stage_flag * 3; i++) {
                var h = {
                    x: 35,
                    y: -30
                };
                // if(enemyShipArr.length < 7){
                h.x = Math.random() * 600;
                h.y = Math.random() * (-50);
                enemyShipArr.push(h);
            }
        }

        function generatorEnemyGunship(i, posArrX, posArrY) {
            var h = {
                x: -100,
                y: -100
            };
            h.x = posArrX;
            h.y = posArrY;
            enemyShipArr.push(h);
        }

        function drawEnemyGunship() {
            var h = {
                x: 35,
                y: 30
            };
            if (enemyShipArr.length > 0) {
                if (counter1 % 43 == 0) { // 소수와의 공배수마다 한번씩 (느리게 이미지 변하게)
                    enemyShip.src = shipImg[3 - counter1 % 4];
                }
                for (var i = 0; i < enemyShipArr.length; i++) {
                    ableEnemyPositionCheck(i);
                    ctx.drawImage(enemyShip, enemyShipArr[i].x, enemyShipArr[i].y, shipSize, shipSize);
                }
            }
        }

        function ablePositionCheck() {
            if (myShipX < 0) {
                myShipX = 600 - shipSize;
            } else if (myShipX > 600 - shipSize) {
                myShipX = 0;
            }
        }

        function ableEnemyPositionCheck(i) {
            // for(var i = 0 ; i < enemyShipArr[i].length; i++){
            if (enemyShipArr[i].x < -shipSize / 2) {
                enemyShipArr[i].x = 600 + shipSize / 2;
            } else if (enemyShipArr[i].x > 600 + shipSize / 2) {
                enemyShipArr[i].x = -shipSize / 2;
            }
            if (enemyShipArr[i].y > 800) {
                enemyShipArr[i].y = 0;
            }
            // }
        }

        function bgmOn() {
            bgSound.currentTime = 0;
            bgSound.play();
        }

        function bgmOff() {
            // bgSound.currentTime=0;
            bgSound.pause();
        }
