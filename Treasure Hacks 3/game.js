//Create Canvas
import { createCanvas } from 'https://cdn.skypack.dev/vb-canvas@0.1.4';
var height = document.body.clientHeight;
var width = document.body.clientWidth;
const { ctx } = createCanvas({
    target: document.body,
    viewBox: [0, 0, width, height],
    scaleMode: 'fill'
});
var canvas = document.querySelector('canvas');

//Mouse Movement
var mousePos = {
    x: 0,
    y: 0
};
document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;
    event = event || window.event;
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    mousePos = {
        x: event.pageX,
        y: event.pageY
    };
}

//Objects
var kills = 0;
var wavesSurvived = 0;
var bulletsUsed = 0;
var bulletsHit = 0;
var bulletPercentage = 0;

function bullet(x,y,parent){
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.r = 5;
    this.color = "orange";
    this.speed = 20;
    this.velX = 1;
    this.velY = 1;
    this.delete = false;
    
    this.barrelX = 0;
    this.barrelY = 0;
    this.barrelDistance = 0;
    this.newAngle = 0;
    
    this.mx = 0;
    this.my = 0;
    this.tx = 0;
    this.ty = 0;
    this.dist = 0;
    this.traveled = 0;
    this.index = -1;
    
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
    this.update = function(){
        this.x1 = this.x - this.r;
        this.y1 = this.y - this.r;
        this.x2 = this.x + this.r;
        this.y2 = this.y + this.r;
        
        if(overlaps(this, character)){
            character.health -= this.parent.damage;
            this.delete = true;
            this.traveled = 0;
        }
        for(var i = 0; i < enemyList.length; i++){
            if(overlaps(this, enemyList[i])){
                enemyList[i].health -= this.parent.damage;
                bulletsHit += 1;
                this.delete = true;
                this.traveled = 0;
            }   
        }
        for(var i  = 0; i < objectList.length; i++){
            if(overlaps(this, objectList[i])){
                this.delete = true;
                this.traveled = 0;
            }
        }
        
        if(this.parent.type == "pistol" || this.parent.type == "epistol"){
            this.speed = 20;
        }
        if(this.parent.type == "ak"){
            this.speed = 25;
        }
        if(this.parent.type == "sniper"){
            this.speed = 40;
        }
        
        this.tx = this.mx - this.x;
        this.ty = this.my - this.y;
        this.dist = Math.sqrt(this.tx * this.tx + this.ty * this.ty);
        if(this.dist >= this.speed){
            this.velX = (this.tx / this.dist) * this.speed;
            this.velY = (this.ty / this.dist) * this.speed;
            this.x += this.velX;
            this.y += this.velY; 
            this.traveled += 1;
        }
        if(this.dist < this.speed || this.parent.range < this.traveled){
            this.delete = true;
            this.traveled = 0;
        }
    }
    this.findBarrel = function(){
        if(this.parent.type == "pistol"){
            this.barrelDistance = -75;
            this.barrelX = character.x - character.r/2 - (this.barrelDistance * Math.cos(character.angle));
            this.barrelY = character.y - character.r/2 - (this.barrelDistance * Math.sin(character.angle));
            this.newAngle = ((character.angle + 96) % 360);
            this.barrelDistance = 8;
            this.barrelX = this.barrelX - (this.barrelDistance * Math.cos(this.newAngle));
            this.barrelY = this.barrelY - (this.barrelDistance * Math.sin(this.newAngle));
        }
        if(this.parent.type == "epistol"){
            this.barrelDistance = -75;
            this.barrelX = backgroundPos.x+enemyList[this.index].x - enemyList[this.index].r/2 - (this.barrelDistance * Math.cos(enemyList[this.index].angle));
            this.barrelY = backgroundPos.y+enemyList[this.index].y - enemyList[this.index].r/2 - (this.barrelDistance * Math.sin(enemyList[this.index].angle));
            this.newAngle = ((enemyList[this.index].angle + 96) % 360);
            this.barrelDistance = 8;
            this.barrelX = this.barrelX - (this.barrelDistance * Math.cos(this.newAngle));
            this.barrelY = this.barrelY - (this.barrelDistance * Math.sin(this.newAngle));
        }
        if(this.parent.type == "ak"){
            this.barrelDistance = -110;
            this.barrelX = character.x - character.r/2 - (this.barrelDistance * Math.cos(character.angle));
            this.barrelY = character.y - character.r/2 - (this.barrelDistance * Math.sin(character.angle));
            this.newAngle = ((character.angle + 96) % 360);
            this.barrelDistance = -11;
            this.barrelX = this.barrelX - (this.barrelDistance * Math.cos(this.newAngle));
            this.barrelY = this.barrelY - (this.barrelDistance * Math.sin(this.newAngle));
        }
        if(this.parent.type == "sniper"){
            this.barrelDistance = -145;
            this.barrelX = character.x - character.r/2 - (this.barrelDistance * Math.cos(character.angle));
            this.barrelY = character.y - character.r/2 - (this.barrelDistance * Math.sin(character.angle));
            this.newAngle = ((character.angle + 96) % 360);
            this.barrelDistance = -11;
            this.barrelX = this.barrelX - (this.barrelDistance * Math.cos(this.newAngle));
            this.barrelY = this.barrelY - (this.barrelDistance * Math.sin(this.newAngle));
        }
    }
}
function gun(parent, x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;
    this.reloadSpeed = 0;
    this.range = 0;
    this.damage = 0;
    this.ammo = 0;
    this.index = -1;
    this.bulletList = [];
    this.shooting = false;
    this.stats = function(){
        if(this.type == "pistol"){
            this.reloadSpeed = 1;
            this.range = 15;
            this.damage = 10;
            this.ammo = 30; 
        }
        if(this.type == "ak"){
            this.reloadSpeed = 2;
            this.range = 20;
            this.damage = 30;
            this.ammo = 60; 
        }
        if(this.type == "sniper"){
            this.reloadSpeed = 3;
            this.range = 70;
            this.damage = 100;
            this.ammo = 5; 
        }
        if(this.type == "epistol"){
            this.reloadSpeed = 1;
            this.range = 15;
            this.damage = 10;
            this.ammo = 30; 
        }
    }
    this.draw = function(){
        if(this.type == "pistol" || this.type == "epistol"){
            this.x = this.x+25;
            this.y = this.y-28
            ctx.fillStyle = "black";
            ctx.fillRect(this.x, this.y, 30, 10);
            ctx.fillStyle = "#757575";
            ctx.fillRect(this.x+2, this.y+2, 26, 6);
        }
        if(this.type == "ak"){
            this.x = this.x+27;
            this.y = this.y-10;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x, this.y, 20, 10);
            ctx.fillStyle = "#644b06";
            ctx.fillRect(this.x+2, this.y+2, 16, 6);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+10, this.y-3, 30, 16);
            ctx.fillStyle = "#555555";
            ctx.fillRect(this.x+12, this.y-1, 26, 12);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+30, this.y-3, 16, 16);
            ctx.fillStyle = "#644b06";
            ctx.fillRect(this.x+32, this.y-1, 12, 12);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+42, this.y, 20, 10);
            ctx.fillStyle = "#555555";
            ctx.fillRect(this.x+44, this.y+2, 16, 6);
        }
        if(this.type == "sniper"){
            this.x = this.x+27;
            this.y = this.y-10;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x-7, this.y-5, 20, 20);
            ctx.fillStyle = "#686662";
            ctx.fillRect(this.x-5, this.y-3, 16, 16);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+10, this.y-3, 60, 16);
            ctx.fillStyle = "#8e6f1e";
            ctx.fillRect(this.x+12, this.y-1, 56, 12);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+32, this.y, 16, 10);
            ctx.fillStyle = "#686662";
            ctx.fillRect(this.x+34, this.y+2, 12, 6);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+42, this.y, 20, 10);
            ctx.fillStyle = "#555555";
            ctx.fillRect(this.x+44, this.y+2, 16, 6);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+67, this.y, 25, 10);
            ctx.fillStyle = "#686662";
            ctx.fillRect(this.x+69, this.y+2, 21, 6);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x+85, this.y-3, 10, 16);
            ctx.fillStyle = "#a4a4a4";
            ctx.fillRect(this.x+87, this.y-1, 6, 12);
        }
    }
    this.shoot = function(){
        if(this.type == "pistol" && this.ammo > 0){
            var pistolBullet = new bullet(this.x+55, this.y-23, pistol);
            pistolBullet.findBarrel();
            pistolBullet.x = pistolBullet.barrelX;
            pistolBullet.y = pistolBullet.barrelY;
            pistolBullet.mx = mousePos.x;
            pistolBullet.my = mousePos.y;
            this.bulletList.push([pistolBullet, false]);
            this.ammo -= 1;
            this.shooting = false;
        }
        if(this.type == "epistol" && this.ammo > 0){
            var epistolBullet = new bullet(this.x+55, this.y-23, enemyGunList[this.index]);
            epistolBullet.index = this.index;
            epistolBullet.findBarrel();
            epistolBullet.x = epistolBullet.barrelX;
            epistolBullet.y = epistolBullet.barrelY;
            epistolBullet.mx = enemyList[this.index].characterX;
            epistolBullet.my = enemyList[this.index].characterY;
            this.bulletList.push([epistolBullet, false]);
            this.ammo -= 1;
            this.shooting = false;
        }
        if(this.type == "ak" && this.ammo > 0){
            var akBullet = new bullet(this.x+55, this.y-23, ak);
            akBullet.findBarrel();
            akBullet.x = akBullet.barrelX;
            akBullet.y = akBullet.barrelY;
            akBullet.mx = mousePos.x;
            akBullet.my = mousePos.y;
            this.bulletList.push([akBullet, false]);
            this.ammo -= 1;
            this.shooting = false;
        }
        if(this.type == "sniper" && this.ammo > 0){
            var sniperBullet = new bullet(this.x+55, this.y-23, sniper);
            sniperBullet.findBarrel();
            sniperBullet.x = sniperBullet.barrelX;
            sniperBullet.y = sniperBullet.barrelY;
            sniperBullet.mx = mousePos.x;
            sniperBullet.my = mousePos.y;
            this.bulletList.push([sniperBullet, false]);
            this.ammo -= 1;
            this.shooting = false;
        }
    }
    this.updateBullet = function(){
        if(this.bulletList != []){
            for(var i = 0; i < this.bulletList.length; i++){
                if(this.bulletList[i][1] == false){
                    this.bulletList[i][0].draw();
                    this.bulletList[i][0].update();   
                    if(this.bulletList[i][0].delete == true){
                        this.bulletList[i][1] = true;
                    }
                }
            }
        }
    }
}
function player(r, x, y){
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 5;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.sprint = false;
    this.health = 100;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.draw = function(){
        ctx.save();
        ctx.translate(this.x-this.r/2, this.y-this.r/2);
        var dx = mousePos.x - (this.x-this.r/2);
        var dy = mousePos.y - (this.y-this.r/2);
        this.angle = Math.atan2(dy, dx);
        ctx.rotate(this.angle);
        
        var subx = this.r/2;
        var suby = this.r/2;
        
        //Gun
        for(var i = 0; i < characterInventory.slots; i++){
            if(characterInventory.selected[i] == 1 && characterInventory.guns[i] != 0){ 
                if(characterInventory.guns[i] == "pistol"){
                    //LeftArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 20, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 20, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();

                    //RightArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby + 20, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby + 20, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();
                    
                    pistol.x = subx;
                    pistol.y = suby;
                    pistol.draw();
                    if(pistol.shooting == true){
                        pistol.shoot();  
                    }
                }
                if(characterInventory.guns[i] == "ak"){
                    //LeftArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 15, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 15, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();

                    //RightArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+40, suby+5, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+40, suby+5, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();

                    ak.x = subx;
                    ak.y = suby;
                    ak.draw();
                    if(ak.shooting == true){
                        ak.shoot();  
                    }
                }
                if(characterInventory.guns[i] == "sniper"){
                    //LeftArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 15, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+20, suby - 15, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();

                    //RightArm
                    ctx.fillStyle = "black";
                    ctx.beginPath();
                    ctx.arc(subx+40, suby+5, this.r/2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.fillStyle = "tan";
                    ctx.beginPath();
                    ctx.arc(subx+40, suby+5, (this.r/2)-4, 0, 2 * Math.PI, false);
                    ctx.fill();

                    sniper.x = subx;
                    sniper.y = suby;
                    sniper.draw();
                    if(sniper.shooting == true){
                        sniper.shoot();  
                    }
                }
            }
        }
        
        //Body
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(subx, suby, this.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = "tan";
        ctx.beginPath();
        ctx.arc(subx, suby, this.r-4, 0, 2 * Math.PI, false);
        ctx.fill();
        
        ctx.restore();
        
        if(this.x - character.r*2 < backgroundPos.x){
            backgroundPos.x = this.x - this.r*2;
        }
        if(this.x + this.r > backgroundPos.x + width*2){
            backgroundPos.x = this.x - width*2 + this.r;
        }
        if(this.y - this.r*2 < backgroundPos.y){
            backgroundPos.y = this.y - this.r*2
        }
        if(this.y + this.r > backgroundPos.y + height*2){
            backgroundPos.y = this.y - height*2 + this.r;
        }
        
        this.x1 = this.x - this.r;
        this.y1 = this.y - this.r;
        this.x2 = this.x + this.r;
        this.y2 = this.y + this.r;
    }
}
var character = new player(32, width/2 - 32, height/2 - 32);
var pistolEle = document.getElementById("pistol");
var akEle = document.getElementById("ak");
var sniperEle = document.getElementById("sniper");
function enemy(r, x, y, type){
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.speed = 1;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.color = "#900009";
    this.sprint = false;
    this.health = 100;
    this.esubx = 0;
    this.esuby = 0;
    this.difx = 0;
    this.dify = 0;
    this.h = 0;
    this.index = -1;
    this.bulletShoot = 0;
    this.characterX = 0;
    this.characterY = 0;
    this.ammo = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.delete = false;
    this.setup = function(){
        this.x = Math.floor(Math.random() * width*2);
        this.y = Math.floor(Math.random() * height*2);
        if(this.type == "pistol"){
            this.ammo = 30;
        }
        if(this.type == "ak"){
            this.ammo = 60;
        }
        if(this.type == "sniper"){
            this.ammo = 5;
        }
    }
    this.movement = function(){
        if(this.ammo <= 1 && ammoDrop.drawing == true){
            if(backgroundPos.x+this.x != backgroundPos.x+ammoDrop.x){
                if(backgroundPos.x+this.x < backgroundPos.x+ammoDrop.x){
                    this.x += this.speed;
                }
                if(backgroundPos.x+this.x > backgroundPos.x+ammoDrop.x){
                    this.x -= this.speed;
                }  
            }
            if(backgroundPos.y+this.y != backgroundPos.y+ammoDrop.y){
                if(backgroundPos.y+this.y < backgroundPos.y+ammoDrop.y){
                    this.y += this.speed;
                }
                if(backgroundPos.y+this.y > backgroundPos.y+ammoDrop.y){
                    this.y -= this.speed;
                }   
            }   
        }
        if(this.ammo > 0 || this.health > 50){
            if(backgroundPos.x+this.x != character.x){
                if(backgroundPos.x+this.x < character.x){
                    this.x += this.speed;
                }
                if(backgroundPos.x+this.x > character.x){
                    this.x -= this.speed;
                }  
            }
            if(backgroundPos.y+this.y != character.y){
                if(backgroundPos.y+this.y < character.y){
                    this.y += this.speed;
                }
                if(backgroundPos.y+this.y > character.y){
                    this.y -= this.speed;
                }   
            }   
        }
    }
    this.draw = function(){
        if(this.delete == false){
            ctx.save();
            ctx.translate(backgroundPos.x+this.x-this.r/2, backgroundPos.y+this.y-this.r/2);
            var dx = backgroundPos.x+this.x+character.x - (this.x-this.r/2) + 16;
            var dy = backgroundPos.y +this.y+character.y - (this.y-this.r/2) + 32;
            this.angle = Math.atan2(-dy, -dx);
            ctx.rotate(this.angle);

            this.esubx = this.r/2;
            this.esuby = this.r/2;

            if(this.type == "pistol"){
                //LeftArm
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(this.esubx+20, this.esuby - 20, this.r/2, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.esubx+20, this.esuby - 20, (this.r/2)-4, 0, 2 * Math.PI, false);
                ctx.fill();

                //RightArm
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(this.esubx+20, this.esuby + 20, this.r/2, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.esubx+20, this.esuby + 20, (this.r/2)-4, 0, 2 * Math.PI, false);
                ctx.fill();

                //Body
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(this.esubx, this.esuby, this.r, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.esubx, this.esuby, this.r-4, 0, 2 * Math.PI, false);
                ctx.fill();  

                if(this.index != -1 && enemyGunList.length > 0){
                    enemyGunList[this.index].x = this.esubx;
                    enemyGunList[this.index].y = this.esuby;
                    enemyGunList[this.index].draw();
                }
            }

            ctx.restore();
            this.movement();

            if(this.type == "pistol"){
                this.bulletShoot = Math.floor(Math.random() * 201);
                if(this.bulletShoot == 1){
                    enemyGunList[this.index].shooting = true;
                    this.characterX = character.x;
                    this.characterY = character.y;
                }   
            }
            if(enemyGunList[this.index].shooting == true){
                enemyGunList[this.index].shoot();  
                this.ammo -= 1;
            }

            enemyList[this.index].x = this.x;
            enemyList[this.index].y = this.y;

            this.x1 = backgroundPos.x+this.x - this.r;
            this.y1 = backgroundPos.y+this.y - this.r;
            this.x2 = backgroundPos.x+this.x + this.r;
            this.y2 = backgroundPos.y+this.y + this.r;
            if(this.health <= 0){
                this.delete = true;
                waveEnemies -= 1;
                kills += 1;
            }
        }
        
    }
}

function inventory(x,y,slots){
    this.x = x;
    this.y = y;
    this.slots = slots;
    this.selected = [1,0,0,0,0,0];
    this.guns = ["pistol","ak","sniper",0,0,0]
    this.index = 49;
    this.draw = function(){
        for(var i = 0; i < this.slots; i++){
            if(this.selected[i] == 1){
                ctx.fillStyle = "#5A5A5A";
                ctx.fillRect(this.x+(i*73), this.y-5, 72, 72);
                ctx.fillStyle = "white";
                ctx.fillRect(this.x+(i*73)+4, this.y-5+4, 64, 64);   
                if(this.guns[i] == "pistol"){
                    ctx.drawImage(pistolEle, this.x+(i*73)+4, this.y-5+4, 64, 64)
                }
                if(this.guns[i] == "ak"){
                    ctx.drawImage(akEle, this.x+(i*73)+4, this.y-5+4, 64, 64)
                }
                if(this.guns[i] == "sniper"){
                    ctx.drawImage(sniperEle, this.x+(i*73)+4, this.y-5+4, 64, 64)
                }
            }
            if(this.selected[i] == 0){
                ctx.fillStyle = "black";
                ctx.fillRect(this.x+(i*73), this.y, 72, 72);
                ctx.fillStyle = "white";
                ctx.fillRect(this.x+(i*73)+4, this.y+4, 64, 64);   
                for(var g = 0; g < this.slots; g++){
                    if(this.guns[i] == "pistol"){
                        ctx.drawImage(pistolEle, this.x+(i*73)+4, this.y+4, 64, 64);
                    }
                    if(this.guns[i] == "ak"){
                        ctx.drawImage(akEle, this.x+(i*73)+4, this.y+4, 64, 64);
                    }
                    if(this.guns[i] == "sniper"){
                        ctx.drawImage(sniperEle, this.x+(i*73)+4, this.y+4, 64, 64);
                    }
                }
            }
        }
    }
    this.findSelected = function(){
        if(this.index == 49){
            characterInventory.selected = [1,0,0,0,0,0];
        }
        if(this.index == 50){
            characterInventory.selected = [0,1,0,0,0,0];
        }
        if(this.index == 51){
            characterInventory.selected = [0,0,1,0,0,0];
        }
        if(this.index == 52){
            characterInventory.selected = [0,0,0,1,0,0];
        }
        if(this.index == 53){
            characterInventory.selected = [0,0,0,0,1,0];
        }
        if(this.index == 54){
            characterInventory.selected = [0,0,0,0,0,1];
        }
    }
}
var characterInventory = new inventory(width/2-260,height-100, 6);

var pistol = new gun(character, character.x, character.y, "pistol");
var ak = new gun(character, character.x, character.y, "ak");
var sniper = new gun(character, character.x, character.y, "sniper");

var ammoEle = document.getElementById("ammo");
var medkitEle = document.getElementById("medkit");
var skullEle = document.getElementById("skull");
var ammoDropTime = 0;
var healthDropTime = 0;
var dropInterval = setInterval(function(){
    ammoDropTime += 1;
    healthDropTime += 1;
}, 1000)
function drop(type, image){
    this.type = type;
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.width = 96;
    this.height = 96;
    this.activate = false;
    this.drawing = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.getvalues = function(){
        this.x = Math.floor(Math.random() * (width*2-64-this.width))+64;
        this.y = Math.floor(Math.random() * (height*2-64-this.height))+64;
        this.offsetX = this.x - backgroundPos.x;
        this.offsetY = this.y - backgroundPos.y;
    }
    this.draw = function(){
        if(this.type == "ammo"){
            if(ammoDropTime > 20 || pistol.ammo == 0 || ak.ammo == 0 || sniper.ammo == 0){
                this.drawing = true;
            }
            if(this.drawing == true){
                ammoDropTime = 0;
                ctx.drawImage(image, backgroundPos.x+this.x, backgroundPos.y+this.y, this.width, this.height);
            }   
            if((character.y + character.r >= backgroundPos.y+this.y && character.y - character.r*2 < backgroundPos.y+this.y + this.height && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x) || (character.y - character.r*2 <= backgroundPos.y+this.y + this.height && character.y + character.r > backgroundPos.y+this.y && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x) || (character.x - character.r*2 <= backgroundPos.x + this.x + this.width && character.x + character.r > backgroundPos.x + this.x && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y) || (character.x + character.r >= backgroundPos.x + this.x && character.x - character.r*2 < backgroundPos.x + this.x + this.width && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y)){
                for(var i = 0; i < characterInventory.slots; i++){
                    if(characterInventory.selected[i] == 1){   
                        if(characterInventory.guns[i] == "pistol"){
                            pistol.ammo += 30;
                        }
                        if(characterInventory.guns[i] == "ak"){
                            ak.ammo += 60;
                        }
                        if(characterInventory.guns[i] == "sniper"){
                            sniper.ammo += 5;
                        }
                    }
                }
                this.x = Math.floor(Math.random() * (width*2-64-this.width))+64;
                this.y = Math.floor(Math.random() * (height*2-64-this.height))+64;
                ammoDropTime = 0;
                this.drawing = false;
                this.offsetX = this.x - backgroundPos.x;
                this.offsetY = this.y - backgroundPos.y;
            }
        }
        if(this.type == "health"){
            if(healthDropTime > 20 || character.health < 50){
                this.drawing = true;
            }   
            if(this.drawing == true){
                healthDropTime = 0;
                ctx.drawImage(image, backgroundPos.x+this.x, backgroundPos.y+this.y, this.width, this.height);
            }   
            if((character.y + character.r >= backgroundPos.y+this.y && character.y - character.r*2 < backgroundPos.y+this.y + this.height && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x) || (character.y - character.r*2 <= backgroundPos.y+this.y + this.height && character.y + character.r > backgroundPos.y+this.y && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x) || (character.x - character.r*2 <= backgroundPos.x + this.x + this.width && character.x + character.r > backgroundPos.x + this.x && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y) || (character.x + character.r >= backgroundPos.x + this.x && character.x - character.r*2 < backgroundPos.x + this.x + this.width && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y)){
                if(character.health < 100){
                    this.x = Math.floor(Math.random() * (width*2-64-this.width))+64;
                    this.y = Math.floor(Math.random() * (height*2-64-this.height))+64;
                    healthDropTime = 0;
                    this.drawing = false;   
                    var healthDifference = 100 - character.health;
                    if(healthDifference > 50){
                        character.health += 50;
                    }
                    if(healthDifference <= 50){
                        character.health = 100;
                    }
                    this.offsetX = this.x - backgroundPos.x;
                    this.offsetY = this.y - backgroundPos.y;
                }
            }
        }
    }
}
var ammoDrop = new drop("ammo", ammoEle);
var healthDrop = new drop("health", medkitEle);

var objectList = [];
var gummybearEle = document.getElementById("gummybear");
var orangegbEle = document.getElementById("orangegb");
var yellowgbEle = document.getElementById("yellowgb");
var bluegbEle = document.getElementById("bluegb");
var ablockEle = document.getElementById("ablock");
var bblockEle = document.getElementById("bblock");
var cblockEle = document.getElementById("cblock");
function newObject(image, wid, hei){
    this.width = wid;
    this.height = hei;
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.move = false;
    this.getvalues = function(){
        this.x = Math.floor(Math.random() * (width*2-64-this.width))+64;
        this.y = Math.floor(Math.random() * (height*2-64-this.height))+64;
    }
    this.draw = function(){
        ctx.drawImage(image, backgroundPos.x+this.x, backgroundPos.y+this.y, this.width, this.height);
        if(character.y + character.r >= backgroundPos.y+this.y && character.y - character.r*2 < backgroundPos.y+this.y + this.height && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x && character.down == true){
            this.move = true;
            this.y += character.speed;
        }
        if(character.y - character.r*2 <= backgroundPos.y+this.y + this.height && character.y + character.r > backgroundPos.y+this.y && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x && character.up == true){
            this.move = true;
            this.y -= character.speed;
        }
        if(character.x - character.r*2 <= backgroundPos.x + this.x + this.width && character.x + character.r > backgroundPos.x + this.x && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y && character.left == true){
            this.move = true;
            this.x -= character.speed;
        }
        if(character.x + character.r >= backgroundPos.x + this.x && character.x - character.r*2 < backgroundPos.x + this.x + this.width && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y && character.right == true){
            this.move = true;
            this.x += character.speed;
        }
        if(this.move == true && character.left == false && character.right == false && character.up == false && character.down == false){
            this.move = false;
            if(character.y + character.r >= backgroundPos.y+this.y && character.y - character.r*2 < backgroundPos.y+this.y + this.height && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x){
                this.y += character.speed;
            }
            if(character.y - character.r*2 <= backgroundPos.y+this.y + this.height && character.y + character.r > backgroundPos.y+this.y && character.x - character.r*2 < backgroundPos.x+this.x + this.width && character.x > backgroundPos.x+this.x){
                this.y -= character.speed*2;
            }
            if(character.x - character.r*2 <= backgroundPos.x + this.x + this.width && character.x + character.r > backgroundPos.x + this.x && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y){
                this.x -= character.speed;
            }
            if(character.x + character.r >= backgroundPos.x + this.x && character.x - character.r*2 < backgroundPos.x + this.x + this.width && character.y - character.r*2 < backgroundPos.y + this.y + this.height && character.y > backgroundPos.y + this.y){
                this.x += character.speed*2;
            }
        }
        
        this.x1 = backgroundPos.x + this.x;
        this.y1 = backgroundPos.y + this.y;
        this.x2 = backgroundPos.x + this.x + this.width;
        this.y2 = backgroundPos.y + this.y + this.height;
    }
}
var gummybear = new newObject(gummybearEle, 200, 300);
var ogummybear = new newObject(orangegbEle, 200, 300);
var ygummybear = new newObject(yellowgbEle, 200, 300);
var bgummybear = new newObject(bluegbEle, 200, 300);
var ablock = new newObject(ablockEle, 150,150);
var bblock = new newObject(bblockEle, 150,150);
var cblock = new newObject(cblockEle, 150,150);
objectList.push(gummybear);
objectList.push(ogummybear);
objectList.push(ygummybear);
objectList.push(bgummybear);
objectList.push(ablock);
objectList.push(bblock);
objectList.push(cblock);

//Key controls
var keyInputs = {
    w: 87,
    a: 65,
    d: 68,
    s: 83,
    lshift: 16,
    space: 32
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var epressed = false;
function keyDownHandler(e){
    if(e.which == keyInputs.w){
        character.vy = -character.speed;
        character.up = true;
    }
    if(e.which == keyInputs.s){
        character.vy = character.speed;
        character.down = true;
    }
    if(e.which == keyInputs.a){
        character.vx = -character.speed;
        character.left = true;
    }
    if(e.which == keyInputs.d){
        character.vx = character.speed;
        character.right = true;
    }
    if(e.which == 49){
        characterInventory.index = 49;
    }
    if(e.which == 50){
        characterInventory.index = 50;
    }
    if(e.which == 51){
        characterInventory.index = 51;
    }
    if(e.which == 52){
        characterInventory.index = 52;
    }
    if(e.which == 53){
        characterInventory.index = 53;
    }
    if(e.which == 54){
        characterInventory.index = 54;
    }
    if(e.which == keyInputs.space){
        bulletsUsed += 1;
        for(var i = 0; i < characterInventory.slots; i++){
            if(characterInventory.selected[i] == 1){
                if(characterInventory.guns[i] == "pistol"){
                    pistol.shooting = true;
                }
                if(characterInventory.guns[i] == "ak"){
                    ak.shooting = true;
                }
                if(characterInventory.guns[i] == "sniper"){
                    sniper.shooting = true;
                }
            }
        }
    }
    if(e.which == 69){
        epressed = true;
    }
}
function keyUpHandler(e){
    if(e.which == keyInputs.w){
        character.vy = 0;
        character.up = false;
    }
    if(e.which == keyInputs.s){
        character.vy = 0;
        character.down = false;
    }
    if(e.which == keyInputs.a){
        character.vx = 0;
        character.left = false;
    }
    if(e.which == keyInputs.d){
        character.vx = 0;
        character.right = false;
    }
    if(e.which == 69){
        epressed = false;
    }
}

//Scroll Wheel
document.addEventListener('wheel', function(e){
    var scrollData = e.deltaY/100;
    characterInventory.index += scrollData;
    if(characterInventory.index > 54){
        characterInventory.index = 49;
    }
    if(characterInventory.index < 49){
        characterInventory.index = 54;
    }
}, false);

//Functions
var backgroundPos = {
    x: character.x-(width),
    y: character.y-(height)
}
var wood = document.getElementById("wood");
function background(){
    ctx.fillStyle= "skyblue";
    ctx.fillRect(backgroundPos.x-1000, backgroundPos.y-1000, width*2+2000, height*2+2000);
    ctx.fillStyle= "white";
    ctx.fillRect(backgroundPos.x-50, backgroundPos.y-50, width*2+100, height*2+100);
    for(var x = 0; x<(width*2/96); x++){
        for(var y = 0; y<(height*2/96); y++){
            ctx.drawImage(wood, backgroundPos.x+x*96, backgroundPos.y+y*96, 96, 96);   
        }
    }
    ctx.fillStyle= "white";
    ctx.fillRect(backgroundPos.x-50, backgroundPos.y+height*2, width*2+100, 50);
    ctx.fillRect(backgroundPos.x+width*2, backgroundPos.y-50, 50, height*2+100);
    ctx.fillStyle= "skyblue";
    ctx.fillRect(backgroundPos.x-50, backgroundPos.y+height*2+50, width*2+100, 50);
}

var waves = 0;
var wavesText = "";
var enemyList = [];
var enemyGunList = [];
var waveEnemies = 0;
var textInterval;
function newWave(){
    waves += 1;
    for(var i = 0; i<waves*2; i++){
        var newEnemy = new enemy(32, 0, 0, "pistol");
        newEnemy.index = i;
        var epistol = new gun(newEnemy, newEnemy.x, newEnemy.y, "epistol");
        epistol.index = i;
        enemyList.push(newEnemy);
        enemyGunList.push(epistol);
    }
    waveEnemies = enemyList.length;
    for(var i = 0; i < enemyGunList.length; i++){
        enemyGunList[i].stats();   
    }
    console.log(enemyList);
    for(var i = 0; i < enemyList.length; i++){
        enemyList[i].setup();   
    }
    wavesText = "Wave " + waves;
    textInterval = setInterval(function(){
        wavesText = "";
    }, 1500);
}

var mmwidth, mmheight, mmx, mmy;
var mmplayerX, mmplayerY;
var mmammoX, mmammoY;
var mmwdif, mmhdif;
function UI(){
    characterInventory.draw();
    characterInventory.findSelected();
    ctx.textAlign = "left";
    ctx.drawImage(ammoEle, 0, 0, 96, 96);
    ctx.fillStyle = "forestgreen";
    ctx.font = "50px VT323";
    for(var i = 0; i < characterInventory.slots; i++){
        if(characterInventory.selected[i] == 1 && characterInventory.guns[i] != 0){ 
            if(characterInventory.guns[i] == "pistol"){
                ctx.fillText(pistol.ammo, 110, 60);
            }
            if(characterInventory.guns[i] == "ak"){
                ctx.fillText(ak.ammo, 110, 60);
            }
            if(characterInventory.guns[i] == "sniper"){
                ctx.fillText(sniper.ammo, 110, 60);
            }
        }
    }
    ctx.drawImage(medkitEle, 0, 100, 96, 96);
    ctx.fillStyle = "#800000";
    ctx.fillRect(100, 120, 210, 55);
    ctx.fillStyle = "#d34a4a";
    ctx.fillRect(105, 125, character.health*2, 45);
    ctx.fillStyle = "white";
    ctx.font = "50px VT323";
    ctx.fillText(character.health + "%", 110, 160);
    ctx.drawImage(skullEle, 10, 220, 80, 80);
    ctx.font = "50px VT323";
    ctx.fillStyle = "#F2F3F5";
    ctx.fillText(waveEnemies, 110, 270);
    
    //Minimap
    mmwidth = width/8-4+5;
    mmheight = height/8-4+5;
    mmx = width-mmwidth-6-5;
    mmy = 10+5;
    mmwdif = (width*2)/mmwidth;
    mmhdif = (height*2)/mmheight;
    ctx.fillStyle = "black";
    ctx.fillRect(mmx-2, mmy-2, mmwidth+4, mmheight+4);
    ctx.fillStyle = "#664617";
    ctx.fillRect(mmx, mmy, mmwidth, mmheight);
    ctx.fillStyle = "tan";
    mmplayerX = -(backgroundPos.x + width)/16+mmx+mmwidth*3/4-5;
    mmplayerY = -(backgroundPos.y + height)/16+mmy+mmheight*3/4-5;
    ctx.fillRect(mmplayerX, mmplayerY, 5, 5);
    
    ctx.textAlign = "center";
    ctx.fillStyle = "#F2F3F5";
    ctx.font = "100px VT323";
    ctx.fillText(wavesText, width/2, 250);
}

function overlaps(a, b) {
	// no horizontal overlap
	if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

	// no vertical overlap
	if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

	return true;
}

function setup(){
    pistol.stats();
    ak.stats();
    sniper.stats();

    gummybear.getvalues();
    ogummybear.getvalues();
    ygummybear.getvalues();
    bgummybear.getvalues(); 
    ablock.getvalues();
    bblock.getvalues();
    cblock.getvalues();
    
    ammoDrop.getvalues();
    healthDrop.getvalues();
}
function drawObjects(){
    gummybear.draw();
    ogummybear.draw();
    ygummybear.draw();
    bgummybear.draw();
    ablock.draw();
    bblock.draw();
    cblock.draw();
    
    ammoDrop.draw();
    healthDrop.draw();
}

//Draw Loop
var gameStart = false;
var alreadyStarted = false;
function drawloop(){
    if(gameStart == false && alreadyStarted == false){
        ctx.fillStyle="skyblue";
        ctx.fillRect(0,0,width,height);
        if(epressed){
            newWave();
            setup();
            gameStart = true;
            alreadyStarted = true;
        }
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "300px VT323";
        ctx.fillText("Toy Royale", width/2, height/2-200);
        ctx.fillStyle = "white";
        ctx.font = "300px VT323";
        ctx.fillText("Toy Royale", width/2+5, height/2-200+5);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "50px VT323";
        ctx.fillText("Directions:", width/2, height/2-100);
        ctx.fillText("1) Survive as many waves as you can", width/2, height/2-50);
        ctx.fillText("2) Get the Highest Amount of kills possible", width/2, height/2);
        ctx.fillText("3) Live out your childhood dreams!", width/2, height/2+50);
        ctx.fillText("Controls:", width/2, height/2+150);
        ctx.fillText("WASD - Move", width/2, height/2+200);
        ctx.fillText("SPACE - Shoot", width/2, height/2+250);
        ctx.fillText("CURSOR - Aim Gun", width/2, height/2+300);
        ctx.fillText("123456/Scroll Wheel - Change Gun", width/2, height/2+350);
        
        ctx.fillStyle = "black";
        ctx.font = "80px VT323";
        ctx.fillText("Press E to start", width/2, height/2+430);
        ctx.fillStyle = "white";
        ctx.font = "80px VT323";
        ctx.fillText("Press E to start", width/2+3, height/2+430+3);
    }
    if(gameStart == true){
        if(waveEnemies <= 0){
            enemyList = [];
            enemyGunList = [];
            clearInterval(textInterval);
            newWave();
        }

        background();
        drawObjects();

        backgroundPos.x -= character.vx;
        backgroundPos.y -= character.vy;

        for(var i = 0; i < enemyList.length; i++){
            enemyList[i].draw();  
        }
        character.draw();

        pistol.updateBullet();
        ak.updateBullet();
        sniper.updateBullet();
        for(var i = 0; i < enemyGunList.length; i++){
            enemyGunList[i].updateBullet();  
        }

        UI();   
        
        if(character.health <= 0){
            gameStart = false;
        }
    }
    if(gameStart == false && alreadyStarted == true){
        bulletPercentage = (bulletsHit/bulletsUsed)*100;
        bulletPercentage = Math.round(bulletPercentage);
        
        ctx.fillStyle="skyblue";
        ctx.fillRect(0,0,width,height);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "300px VT323";
        ctx.fillText("Toy Royale", width/2, height/2-200);
        ctx.fillStyle = "white";
        ctx.font = "300px VT323";
        ctx.fillText("Toy Royale", width/2+5, height/2-200+5);
        
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "50px VT323";
        ctx.fillText("Scores:", width/2, height/2-100);
        ctx.fillText("KILLS - " + kills, width/2, height/2-50);
        ctx.fillText("WAVES SURVIVED - " + waves, width/2, height/2);
        ctx.fillText("BULLETS SHOT - " + bulletsUsed, width/2, height/2+50);
        ctx.fillText("BULLETS HIT - " + bulletsHit, width/2, height/2+100);
        ctx.fillText("ACCURACY - " + bulletPercentage + "%", width/2, height/2+150);
        
        ctx.fillStyle = "black";
        ctx.font = "80px VT323";
        ctx.fillText("Press E to start", width/2, height/2+430);
        ctx.fillStyle = "white";
        ctx.font = "80px VT323";
        ctx.fillText("Press E to start", width/2+3, height/2+430+3);
        if(epressed){
            newWave();
            setup();
            gameStart = true;
            kills = 0;
            waves = 0;
            bulletsUsed = 0;
            bulletsHit = 0;
            bulletPercentage = 0;
            enemyList = [];
            enemyGunList = [];
        }
    }
    
    requestAnimationFrame(drawloop);
}
drawloop();